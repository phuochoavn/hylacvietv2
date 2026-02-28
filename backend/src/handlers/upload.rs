use axum::{
    extract::{Multipart, State},
    http::StatusCode,
    Json,
};
use std::sync::Arc;
use rusqlite::Connection;
use std::sync::Mutex;
use tokio::fs;
use uuid::Uuid;

use crate::models::ApiResponse;

#[derive(serde::Serialize)]
pub struct UploadResponse {
    pub url: String,
    pub filename: String,
}

pub async fn upload_image(
    State(_db): State<Arc<Mutex<Connection>>>,
    mut multipart: Multipart,
) -> Result<(StatusCode, Json<ApiResponse<UploadResponse>>), (StatusCode, Json<ApiResponse<()>>)> {
    // Ensure uploads directory exists
    if let Err(e) = fs::create_dir_all("uploads").await {
        eprintln!("Failed to create uploads directory: {}", e);
        return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string()))));
    }

    while let Ok(Some(field)) = multipart.next_field().await {
        let field_name = field.name().unwrap_or("").to_string();
        let original_filename = field.file_name().unwrap_or("unknown").to_string();
        
        println!("Upload field: name={}, filename={}", field_name, original_filename);
        
        // Accept any field that looks like a file upload (has filename or is named file/image)
        if field_name.is_empty() && original_filename == "unknown" {
            continue;
        }

        // Get content type - try from field, then infer from filename
        let content_type = field.content_type()
            .map(|s| s.to_string())
            .unwrap_or_else(|| {
                // Infer from filename extension
                let lower = original_filename.to_lowercase();
                if lower.ends_with(".jpg") || lower.ends_with(".jpeg") {
                    "image/jpeg".to_string()
                } else if lower.ends_with(".png") {
                    "image/png".to_string()
                } else if lower.ends_with(".gif") {
                    "image/gif".to_string()
                } else if lower.ends_with(".webp") {
                    "image/webp".to_string()
                } else if lower.ends_with(".svg") {
                    "image/svg+xml".to_string()
                } else {
                    "application/octet-stream".to_string()
                }
            });

        println!("Upload content type: {}", content_type);

        // Validate image type - allow images or application/octet-stream (will check bytes)
        if !content_type.starts_with("image/") && content_type != "application/octet-stream" {
            println!("Invalid content type: {}", content_type);
            return Err((StatusCode::BAD_REQUEST, Json(ApiResponse::<()>::error(&format!("Only image files are allowed, got: {}", content_type)))));
        }

        // Read bytes
        let data = match field.bytes().await {
            Ok(d) => d,
            Err(e) => {
                eprintln!("Failed to read upload bytes: {}", e);
                return Err((StatusCode::BAD_REQUEST, Json(ApiResponse::<()>::error(&e.to_string()))));
            }
        };

        println!("Upload size: {} bytes", data.len());

        // Check size (max 50MB)
        if data.len() > 50 * 1024 * 1024 {
            return Err((StatusCode::BAD_REQUEST, Json(ApiResponse::<()>::error("File too large (max 50MB)"))));
        }

        // Check if empty
        if data.is_empty() {
            return Err((StatusCode::BAD_REQUEST, Json(ApiResponse::<()>::error("Empty file"))));
        }

        // For SVG and GIF: save as-is (no processing)
        let is_svg = content_type == "image/svg+xml" || original_filename.to_lowercase().ends_with(".svg");
        let is_gif = content_type == "image/gif" || original_filename.to_lowercase().ends_with(".gif");

        if is_svg || is_gif {
            let ext = if is_svg { "svg" } else { "gif" };
            let filename = format!("{}.{}", Uuid::new_v4(), ext);
            let file_path = format!("uploads/{}", filename);
            if let Err(e) = fs::write(&file_path, &data).await {
                eprintln!("Failed to write file: {}", e);
                return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string()))));
            }
            println!("Upload success (no processing): {}", filename);
            let response = UploadResponse {
                url: format!("/uploads/{}", filename),
                filename,
            };
            return Ok((StatusCode::OK, Json(ApiResponse::success(response))));
        }

        // For raster images (PNG, JPG, WebP): resize + convert to WebP
        let original_size = data.len();
        let processed = tokio::task::spawn_blocking(move || -> Result<Vec<u8>, String> {
            use image::ImageReader;
            use std::io::Cursor;

            // Decode image
            let reader = ImageReader::new(Cursor::new(&data))
                .with_guessed_format()
                .map_err(|e| format!("Failed to read image format: {}", e))?;
            let img = reader.decode()
                .map_err(|e| format!("Failed to decode image: {}", e))?;

            // Resize if wider than 1200px (preserve aspect ratio)
            let max_width = 1200u32;
            let resized = if img.width() > max_width {
                println!("Resizing from {}x{} to max width {}", img.width(), img.height(), max_width);
                img.resize(max_width, u32::MAX, image::imageops::FilterType::Lanczos3)
            } else {
                img
            };

            // Encode to WebP quality 85
            let mut buf = Cursor::new(Vec::new());
            resized.write_to(&mut buf, image::ImageFormat::WebP)
                .map_err(|e| format!("Failed to encode WebP: {}", e))?;

            Ok(buf.into_inner())
        }).await.map_err(|e| {
            eprintln!("Image processing task failed: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;

        let webp_data = processed.map_err(|e| {
            eprintln!("Image processing error: {}", e);
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e)))
        })?;

        let filename = format!("{}.webp", Uuid::new_v4());
        let file_path = format!("uploads/{}", filename);

        println!("Processed: {} bytes -> {} bytes WebP", original_size, webp_data.len());

        if let Err(e) = fs::write(&file_path, &webp_data).await {
            eprintln!("Failed to write file: {}", e);
            return Err((StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string()))));
        }

        println!("Upload success: {}", filename);

        let response = UploadResponse {
            url: format!("/uploads/{}", filename),
            filename,
        };

        return Ok((StatusCode::OK, Json(ApiResponse::success(response))));
    }

    eprintln!("No file uploaded - no valid field found");
    Err((StatusCode::BAD_REQUEST, Json(ApiResponse::<()>::error("No file uploaded"))))
}

