use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use rusqlite::params;
use chrono::Utc;

use crate::db::DbPool;
use crate::models::{ApiResponse, Setting, UpdateSettings, DashboardStats, Order};

/// GET /api/settings - Get all settings (public)
pub async fn get_all_settings(
    State(db): State<DbPool>,
) -> Result<Json<ApiResponse<Vec<Setting>>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let mut stmt = conn.prepare("SELECT key, value, type, updated_at FROM settings")
        .map_err(|e| {
            (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
        })?;
    
    let settings: Vec<Setting> = stmt.query_map([], |row| {
        Ok(Setting {
            key: row.get(0)?,
            value: row.get(1)?,
            r#type: row.get(2)?,
            updated_at: row.get(3)?,
        })
    }).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?.filter_map(|r| r.ok()).collect();
    
    Ok(Json(ApiResponse::success(settings)))
}

/// GET /api/settings/:key - Get single setting
pub async fn get_setting(
    State(db): State<DbPool>,
    axum::extract::Path(key): axum::extract::Path<String>,
) -> Result<Json<ApiResponse<Setting>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let setting = conn.query_row(
        "SELECT key, value, type, updated_at FROM settings WHERE key = ?1",
        params![key],
        |row| {
            Ok(Setting {
                key: row.get(0)?,
                value: row.get(1)?,
                r#type: row.get(2)?,
                updated_at: row.get(3)?,
            })
        }
    ).map_err(|_| {
        (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("Setting not found")))
    })?;
    
    Ok(Json(ApiResponse::success(setting)))
}

/// PUT /api/settings - Update settings (auth required)
pub async fn update_settings(
    State(db): State<DbPool>,
    Json(payload): Json<UpdateSettings>,
) -> Result<Json<ApiResponse<Vec<Setting>>>, (StatusCode, Json<ApiResponse<()>>)> {
    let now = Utc::now().to_rfc3339();
    
    {
        let conn = db.lock().unwrap();
        for setting in &payload.settings {
            // Use INSERT OR REPLACE to create new settings or update existing ones
            conn.execute(
                "INSERT OR REPLACE INTO settings (key, value, type, updated_at) VALUES (?1, ?2, 'string', ?3)",
                params![setting.key, setting.value, now],
            ).map_err(|e| {
                (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
            })?;
        }
    }
    
    get_all_settings(State(db)).await
}

/// GET /api/stats - Get dashboard stats (auth required)
pub async fn get_stats(
    State(db): State<DbPool>,
) -> Result<Json<ApiResponse<DashboardStats>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let total_products: i64 = conn.query_row("SELECT COUNT(*) FROM products", [], |row| row.get(0)).unwrap_or(0);
    let active_products: i64 = conn.query_row("SELECT COUNT(*) FROM products WHERE status = 'active'", [], |row| row.get(0)).unwrap_or(0);
    let total_orders: i64 = conn.query_row("SELECT COUNT(*) FROM orders", [], |row| row.get(0)).unwrap_or(0);
    let pending_orders: i64 = conn.query_row("SELECT COUNT(*) FROM orders WHERE status = 'pending'", [], |row| row.get(0)).unwrap_or(0);
    
    let mut stmt = conn.prepare(
        "SELECT id, customer_name, customer_phone, customer_email, product_id, product_name, measurements, notes, status, created_at, updated_at 
         FROM orders ORDER BY created_at DESC LIMIT 5"
    ).map_err(|e| {
        (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
    })?;
    
    let recent_orders: Vec<Order> = stmt.query_map([], |row| {
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
    
    Ok(Json(ApiResponse::success(DashboardStats {
        total_products,
        active_products,
        total_orders,
        pending_orders,
        recent_orders,
    })))
}
