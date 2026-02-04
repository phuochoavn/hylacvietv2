use axum::{
    extract::State,
    http::StatusCode,
    Json,
};
use rusqlite::params;
use sha2::{Sha256, Digest};
use jsonwebtoken::{encode, Header, EncodingKey};
use chrono::{Utc, Duration};

use crate::db::DbPool;
use crate::models::{ApiResponse, LoginRequest, LoginResponse, AdminUserPublic, Claims};

const JWT_SECRET: &str = "hylacviet-secret-key-change-in-production";

fn hash_password(password: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    format!("{:x}", hasher.finalize())
}

/// POST /api/auth/login - Admin login
pub async fn login(
    State(db): State<DbPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<ApiResponse<LoginResponse>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let password_hash = hash_password(&payload.password);
    
    let user = conn.query_row(
        "SELECT id, username, password_hash, role FROM admin_users WHERE username = ?1",
        params![payload.username],
        |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
            ))
        }
    );
    
    match user {
        Ok((id, username, stored_hash, role)) => {
            if stored_hash != password_hash {
                return Err((StatusCode::UNAUTHORIZED, Json(ApiResponse::<()>::error("Invalid username or password"))));
            }
            
            // Update last login
            let _ = conn.execute(
                "UPDATE admin_users SET last_login = ?1 WHERE id = ?2",
                params![Utc::now().to_rfc3339(), id],
            );
            
            // Create JWT token
            let now = Utc::now();
            let exp = now + Duration::hours(24);
            
            let claims = Claims {
                sub: id.clone(),
                username: username.clone(),
                role: role.clone(),
                iat: now.timestamp() as usize,
                exp: exp.timestamp() as usize,
            };
            
            let token = encode(
                &Header::default(),
                &claims,
                &EncodingKey::from_secret(JWT_SECRET.as_ref()),
            ).map_err(|e| {
                (StatusCode::INTERNAL_SERVER_ERROR, Json(ApiResponse::<()>::error(&e.to_string())))
            })?;
            
            Ok(Json(ApiResponse::success(LoginResponse {
                token,
                user: AdminUserPublic { id, username, role },
            })))
        }
        Err(_) => {
            Err((StatusCode::UNAUTHORIZED, Json(ApiResponse::<()>::error("Invalid username or password"))))
        }
    }
}

/// GET /api/auth/me - Get current user info
pub async fn get_me(
    State(db): State<DbPool>,
    axum::Extension(claims): axum::Extension<Claims>,
) -> Result<Json<ApiResponse<AdminUserPublic>>, (StatusCode, Json<ApiResponse<()>>)> {
    let conn = db.lock().unwrap();
    
    let user = conn.query_row(
        "SELECT id, username, role FROM admin_users WHERE id = ?1",
        params![claims.sub],
        |row| {
            Ok(AdminUserPublic {
                id: row.get(0)?,
                username: row.get(1)?,
                role: row.get(2)?,
            })
        }
    ).map_err(|_| {
        (StatusCode::NOT_FOUND, Json(ApiResponse::<()>::error("User not found")))
    })?;
    
    Ok(Json(ApiResponse::success(user)))
}

pub fn get_jwt_secret() -> &'static str {
    JWT_SECRET
}
