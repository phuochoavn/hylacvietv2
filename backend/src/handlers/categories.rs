use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use chrono::Utc;
use std::sync::Arc;
use rusqlite::Connection;
use std::sync::Mutex;
use uuid::Uuid;

use crate::models::{ApiResponse, Category, CreateCategory, UpdateCategory};

pub type DbPool = Arc<Mutex<Connection>>;

pub async fn list_categories(
    State(db): State<DbPool>,
) -> Result<(StatusCode, Json<ApiResponse<Vec<Category>>>), (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Database lock error")))
    })?;

    let mut stmt = conn.prepare(
        "SELECT id, name, slug, icon, image, description, sort_order, created_at, updated_at 
         FROM categories ORDER BY sort_order ASC, created_at DESC"
    ).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;

    let categories: Vec<Category> = stmt.query_map([], |row| {
        Ok(Category {
            id: row.get(0)?,
            name: row.get(1)?,
            slug: row.get(2)?,
            icon: row.get::<_, String>(3).unwrap_or_default(),
            image: row.get::<_, String>(4).unwrap_or_default(),
            description: row.get::<_, String>(5).unwrap_or_default(),
            sort_order: row.get(6)?,
            created_at: row.get(7)?,
            updated_at: row.get(8).ok(),
        })
    }).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?.filter_map(|r| r.ok()).collect();

    Ok((StatusCode::OK, Json(ApiResponse::success(categories))))
}

pub async fn get_category(
    State(db): State<DbPool>,
    Path(id): Path<String>,
) -> Result<(StatusCode, Json<ApiResponse<Category>>), (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Database lock error")))
    })?;

    let category = conn.query_row(
        "SELECT id, name, slug, icon, image, description, sort_order, created_at, updated_at 
         FROM categories WHERE id = ?1 OR slug = ?1",
        [&id],
        |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                icon: row.get::<_, String>(3).unwrap_or_default(),
                image: row.get::<_, String>(4).unwrap_or_default(),
                description: row.get::<_, String>(5).unwrap_or_default(),
                sort_order: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8).ok(),
            })
        }
    ).map_err(|_| {
        (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Category not found")))
    })?;

    Ok((StatusCode::OK, Json(ApiResponse::success(category))))
}

pub async fn create_category(
    State(db): State<DbPool>,
    Json(input): Json<CreateCategory>,
) -> Result<(StatusCode, Json<ApiResponse<Category>>), (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Database lock error")))
    })?;

    let id = format!("cat_{}", Uuid::new_v4().to_string().split('-').next().unwrap());
    let now = Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string();

    conn.execute(
        "INSERT INTO categories (id, name, slug, icon, image, description, sort_order, created_at) 
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        (
            &id,
            &input.name,
            &input.slug,
            &input.icon,
            &input.image,
            &input.description,
            input.sort_order,
            &now,
        ),
    ).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;

    let category = Category {
        id,
        name: input.name,
        slug: input.slug,
        icon: input.icon,
        image: input.image,
        description: input.description,
        sort_order: input.sort_order,
        created_at: now,
        updated_at: None,
    };

    Ok((StatusCode::CREATED, Json(ApiResponse::success(category))))
}

pub async fn update_category(
    State(db): State<DbPool>,
    Path(id): Path<String>,
    Json(input): Json<UpdateCategory>,
) -> Result<(StatusCode, Json<ApiResponse<Category>>), (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Database lock error")))
    })?;

    // First get existing category
    let existing = conn.query_row(
        "SELECT id, name, slug, icon, image, description, sort_order, created_at, updated_at 
         FROM categories WHERE id = ?1",
        [&id],
        |row| {
            Ok(Category {
                id: row.get(0)?,
                name: row.get(1)?,
                slug: row.get(2)?,
                icon: row.get::<_, String>(3).unwrap_or_default(),
                image: row.get::<_, String>(4).unwrap_or_default(),
                description: row.get::<_, String>(5).unwrap_or_default(),
                sort_order: row.get(6)?,
                created_at: row.get(7)?,
                updated_at: row.get(8).ok(),
            })
        }
    ).map_err(|_| {
        (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Category not found")))
    })?;

    let now = Utc::now().format("%Y-%m-%dT%H:%M:%SZ").to_string();
    let updated = Category {
        id: existing.id.clone(),
        name: input.name.unwrap_or(existing.name),
        slug: input.slug.unwrap_or(existing.slug),
        icon: input.icon.unwrap_or(existing.icon),
        image: input.image.unwrap_or(existing.image),
        description: input.description.unwrap_or(existing.description),
        sort_order: input.sort_order.unwrap_or(existing.sort_order),
        created_at: existing.created_at,
        updated_at: Some(now.clone()),
    };

    conn.execute(
        "UPDATE categories SET name = ?1, slug = ?2, icon = ?3, image = ?4, description = ?5, 
         sort_order = ?6, updated_at = ?7 WHERE id = ?8",
        (
            &updated.name,
            &updated.slug,
            &updated.icon,
            &updated.image,
            &updated.description,
            updated.sort_order,
            &now,
            &id,
        ),
    ).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;

    Ok((StatusCode::OK, Json(ApiResponse::success(updated))))
}

pub async fn delete_category(
    State(db): State<DbPool>,
    Path(id): Path<String>,
) -> Result<(StatusCode, Json<ApiResponse<()>>), (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().map_err(|_| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error("Database lock error")))
    })?;

    let affected = conn.execute("DELETE FROM categories WHERE id = ?1", [&id])
        .map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;

    if affected == 0 {
        return Err((StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Category not found"))));
    }

    Ok((StatusCode::OK, Json(ApiResponse { success: true, data: None, message: Some("Category deleted".to_string()) })))
}
