use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use rusqlite::params;
use uuid::Uuid;
use chrono::Utc;

use crate::db::{DbPool, parse_json_array, to_json_array};
use crate::models::{ApiResponse, Product, CreateProduct, UpdateProduct, PaginationParams, PaginatedResponse};

/// GET /api/products - List all products
pub async fn list_products(
    State(db): State<DbPool>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<Product>>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let mut sql = "SELECT id, name, description, price, images, category, status, sort_order, created_at, updated_at FROM products WHERE 1=1".to_string();
    let mut count_sql = "SELECT COUNT(*) FROM products WHERE 1=1".to_string();
    
    if let Some(ref status) = params.status {
        sql.push_str(&format!(" AND status = '{}'", status));
        count_sql.push_str(&format!(" AND status = '{}'", status));
    }
    if let Some(ref category) = params.category {
        sql.push_str(&format!(" AND category = '{}'", category));
        count_sql.push_str(&format!(" AND category = '{}'", category));
    }
    
    sql.push_str(" ORDER BY sort_order ASC, created_at DESC");
    
    let offset = (params.page - 1) * params.limit;
    sql.push_str(&format!(" LIMIT {} OFFSET {}", params.limit, offset));
    
    let total: i64 = conn.query_row(&count_sql, [], |row| row.get(0)).unwrap_or(0);
    
    let mut stmt = conn.prepare(&sql).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;
    
    let products: Vec<Product> = stmt.query_map([], |row| {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            description: row.get(2)?,
            price: row.get(3)?,
            images: parse_json_array(&row.get::<_, String>(4)?),
            category: row.get(5)?,
            status: row.get(6)?,
            sort_order: row.get(7)?,
            created_at: row.get(8)?,
            updated_at: row.get(9).ok(),
        })
    }).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?.filter_map(|r| r.ok()).collect();
    
    let total_pages = ((total as f64) / (params.limit as f64)).ceil() as u32;
    
    Ok(Json(ApiResponse::success(PaginatedResponse {
        items: products,
        total,
        page: params.page,
        limit: params.limit,
        total_pages,
    })))
}

/// GET /api/products/:id - Get single product
pub async fn get_product(
    State(db): State<DbPool>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<Product>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let product = conn.query_row(
        "SELECT id, name, description, price, images, category, status, sort_order, created_at, updated_at 
         FROM products WHERE id = ?1",
        params![id],
        |row| {
            Ok(Product {
                id: row.get(0)?,
                name: row.get(1)?,
                description: row.get(2)?,
                price: row.get(3)?,
                images: parse_json_array(&row.get::<_, String>(4)?),
                category: row.get(5)?,
                status: row.get(6)?,
                sort_order: row.get(7)?,
                created_at: row.get(8)?,
                updated_at: row.get(9).ok(),
            })
        }
    ).map_err(|_| {
        (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Product not found")))
    })?;
    
    Ok(Json(ApiResponse::success(product)))
}

/// POST /api/products - Create product (auth required)
pub async fn create_product(
    State(db): State<DbPool>,
    Json(payload): Json<CreateProduct>,
) -> Result<Json<ApiResponse<Product>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    let images_json = to_json_array(&payload.images);
    
    conn.execute(
        "INSERT INTO products (id, name, description, price, images, category, status, sort_order, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'active', ?7, ?8)",
        params![id, payload.name, payload.description, payload.price, images_json, payload.category, payload.sort_order, now],
    ).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;
    
    let product = Product {
        id,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        images: payload.images,
        category: payload.category,
        status: "active".to_string(),
        sort_order: payload.sort_order,
        created_at: now,
        updated_at: None,
    };
    
    Ok(Json(ApiResponse::success(product)))
}

/// PUT /api/products/:id - Update product (auth required)
pub async fn update_product(
    State(db): State<DbPool>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateProduct>,
) -> Result<Json<ApiResponse<Product>>, (StatusCode, Json<ApiResponse<()>>)> {
    let now = Utc::now().to_rfc3339();
    let images_json = payload.images.as_ref().map(|i| to_json_array(i));
    
    {
        let conn = db.lock().unwrap();
        conn.execute(
            "UPDATE products SET 
                name = COALESCE(?1, name),
                description = COALESCE(?2, description),
                price = COALESCE(?3, price),
                images = COALESCE(?4, images),
                category = COALESCE(?5, category),
                status = COALESCE(?6, status),
                sort_order = COALESCE(?7, sort_order),
                updated_at = ?8
             WHERE id = ?9",
            params![
                payload.name,
                payload.description,
                payload.price,
                images_json,
                payload.category,
                payload.status,
                payload.sort_order,
                now,
                id
            ],
        ).map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;
    }
    
    // Fetch updated product
    get_product(State(db), Path(id)).await
}

/// DELETE /api/products/:id - Delete product (auth required)
pub async fn delete_product(
    State(db): State<DbPool>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<()>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let rows = conn.execute("DELETE FROM products WHERE id = ?1", params![id])
        .map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;
    
    if rows == 0 {
        return Err((StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Product not found"))));
    }
    
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        message: Some("Product deleted".to_string()),
    }))
}
