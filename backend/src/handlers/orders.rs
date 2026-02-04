use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    Json,
};
use rusqlite::params;
use uuid::Uuid;
use chrono::Utc;

use crate::db::DbPool;
use crate::models::{ApiResponse, Order, CreateOrder, UpdateOrder, PaginationParams, PaginatedResponse};

/// GET /api/orders - List all orders (auth required)
pub async fn list_orders(
    State(db): State<DbPool>,
    Query(params): Query<PaginationParams>,
) -> Result<Json<ApiResponse<PaginatedResponse<Order>>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let mut sql = "SELECT id, customer_name, customer_phone, customer_email, product_id, product_name, measurements, notes, status, created_at, updated_at FROM orders WHERE 1=1".to_string();
    let mut count_sql = "SELECT COUNT(*) FROM orders WHERE 1=1".to_string();
    
    if let Some(ref status) = params.status {
        sql.push_str(&format!(" AND status = '{}'", status));
        count_sql.push_str(&format!(" AND status = '{}'", status));
    }
    
    sql.push_str(" ORDER BY created_at DESC");
    
    let offset = (params.page - 1) * params.limit;
    sql.push_str(&format!(" LIMIT {} OFFSET {}", params.limit, offset));
    
    let total: i64 = conn.query_row(&count_sql, [], |row| row.get(0)).unwrap_or(0);
    
    let mut stmt = conn.prepare(&sql).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;
    
    let orders: Vec<Order> = stmt.query_map([], |row| {
        Ok(Order {
            id: row.get(0)?,
            customer_name: row.get(1)?,
            customer_phone: row.get(2)?,
            customer_email: row.get(3)?,
            product_id: row.get(4).ok(),
            product_name: row.get(5)?,
            measurements: row.get(6)?,
            notes: row.get(7)?,
            status: row.get(8)?,
            created_at: row.get(9)?,
            updated_at: row.get(10).ok(),
        })
    }).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?.filter_map(|r| r.ok()).collect();
    
    let total_pages = ((total as f64) / (params.limit as f64)).ceil() as u32;
    
    Ok(Json(ApiResponse::success(PaginatedResponse {
        items: orders,
        total,
        page: params.page,
        limit: params.limit,
        total_pages,
    })))
}

/// GET /api/orders/:id - Get single order (auth required)
pub async fn get_order(
    State(db): State<DbPool>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<Order>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let order = conn.query_row(
        "SELECT id, customer_name, customer_phone, customer_email, product_id, product_name, measurements, notes, status, created_at, updated_at 
         FROM orders WHERE id = ?1",
        params![id],
        |row| {
            Ok(Order {
                id: row.get(0)?,
                customer_name: row.get(1)?,
                customer_phone: row.get(2)?,
                customer_email: row.get(3)?,
                product_id: row.get(4).ok(),
                product_name: row.get(5)?,
                measurements: row.get(6)?,
                notes: row.get(7)?,
                status: row.get(8)?,
                created_at: row.get(9)?,
                updated_at: row.get(10).ok(),
            })
        }
    ).map_err(|_| {
        (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Order not found")))
    })?;
    
    Ok(Json(ApiResponse::success(order)))
}

/// POST /api/orders - Create order (public)
pub async fn create_order(
    State(db): State<DbPool>,
    Json(payload): Json<CreateOrder>,
) -> Result<Json<ApiResponse<Order>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();
    
    // Get product name if product_id is provided
    let product_name = if let Some(ref pid) = payload.product_id {
        conn.query_row("SELECT name FROM products WHERE id = ?1", params![pid], |row| row.get(0))
            .unwrap_or(payload.product_name.clone())
    } else {
        payload.product_name.clone()
    };
    
    conn.execute(
        "INSERT INTO orders (id, customer_name, customer_phone, customer_email, product_id, product_name, measurements, notes, status, created_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 'pending', ?9)",
        params![id, payload.customer_name, payload.customer_phone, payload.customer_email, payload.product_id, product_name, payload.measurements, payload.notes, now],
    ).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;
    
    let order = Order {
        id,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        customer_email: payload.customer_email,
        product_id: payload.product_id,
        product_name,
        measurements: payload.measurements,
        notes: payload.notes,
        status: "pending".to_string(),
        created_at: now,
        updated_at: None,
    };
    
    Ok(Json(ApiResponse::success(order)))
}

/// PUT /api/orders/:id - Update order (auth required)
pub async fn update_order(
    State(db): State<DbPool>,
    Path(id): Path<String>,
    Json(payload): Json<UpdateOrder>,
) -> Result<Json<ApiResponse<Order>>, (StatusCode, Json<ApiResponse<()>>)> {
    let now = Utc::now().to_rfc3339();
    
    {
        let conn = db.lock().unwrap();
        conn.execute(
            "UPDATE orders SET 
                customer_name = COALESCE(?1, customer_name),
                customer_phone = COALESCE(?2, customer_phone),
                customer_email = COALESCE(?3, customer_email),
                product_id = COALESCE(?4, product_id),
                product_name = COALESCE(?5, product_name),
                measurements = COALESCE(?6, measurements),
                notes = COALESCE(?7, notes),
                status = COALESCE(?8, status),
                updated_at = ?9
             WHERE id = ?10",
            params![
                payload.customer_name,
                payload.customer_phone,
                payload.customer_email,
                payload.product_id,
                payload.product_name,
                payload.measurements,
                payload.notes,
                payload.status,
                now,
                id
            ],
        ).map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;
    }
    
    get_order(State(db), Path(id)).await
}

/// DELETE /api/orders/:id - Delete order (auth required)
pub async fn delete_order(
    State(db): State<DbPool>,
    Path(id): Path<String>,
) -> Result<Json<ApiResponse<()>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let rows = conn.execute("DELETE FROM orders WHERE id = ?1", params![id])
        .map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;
    
    if rows == 0 {
        return Err((StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Order not found"))));
    }
    
    Ok(Json(ApiResponse {
        success: true,
        data: None,
        message: Some("Order deleted".to_string()),
    }))
}
