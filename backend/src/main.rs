mod db;
mod handlers;
mod models;

use axum::{
    extract::{Request, State, DefaultBodyLimit},
    http::{header, Method, StatusCode},
    middleware::{self, Next},
    response::Response,
    routing::{get, post, put, delete},
    Json, Router,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;
use std::net::SocketAddr;
use tokio::fs;

use crate::db::DbPool;
use crate::models::{ApiResponse, Claims};
use crate::handlers::auth::get_jwt_secret;

async fn auth_middleware(
    State(db): State<DbPool>,
    mut request: Request,
    next: Next,
) -> Result<Response, (StatusCode, Json<ApiResponse<()>>)> {
    let auth_header = request.headers()
        .get(header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok());
    
    let token = match auth_header {
        Some(h) if h.starts_with("Bearer ") => &h[7..],
        _ => return Err((StatusCode::UNAUTHORIZED, Json(ApiResponse::<()>::error("Missing or invalid authorization header")))),
    };
    
    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(get_jwt_secret().as_ref()),
        &Validation::default(),
    ).map_err(|_| {
        (StatusCode::UNAUTHORIZED, Json(ApiResponse::<()>::error("Invalid or expired token")))
    })?.claims;
    
    request.extensions_mut().insert(claims);
    
    Ok(next.run(request).await)
}

#[tokio::main]
async fn main() {
    println!("🚀 Hỷ Lạc Việt API starting...");
    
    // Ensure data directory exists
    fs::create_dir_all("data").await.expect("Failed to create data directory");
    fs::create_dir_all("uploads").await.expect("Failed to create uploads directory");
    
    // Initialize database
    let db = db::init_db().expect("Failed to initialize database");
    println!("✅ Database initialized");
    
    // Public routes
    let public_routes = Router::new()
        .route("/api/products", get(handlers::list_products))
        .route("/api/products/{id}", get(handlers::get_product))
        .route("/api/categories", get(handlers::list_categories))
        .route("/api/categories/{id}", get(handlers::get_category))
        .route("/api/orders", post(handlers::create_order))
        .route("/api/settings", get(handlers::get_all_settings))
        .route("/api/settings/{key}", get(handlers::get_setting))
        .route("/api/auth/login", post(handlers::login));
    
    // Protected routes (require authentication)
    let protected_routes = Router::new()
        .route("/api/products", post(handlers::create_product))
        .route("/api/products/{id}", put(handlers::update_product))
        .route("/api/products/{id}", delete(handlers::delete_product))
        .route("/api/categories", post(handlers::create_category))
        .route("/api/categories/{id}", put(handlers::update_category))
        .route("/api/categories/{id}", delete(handlers::delete_category))
        .route("/api/orders", get(handlers::list_orders))
        .route("/api/orders/{id}", get(handlers::get_order))
        .route("/api/orders/{id}", put(handlers::update_order))
        .route("/api/orders/{id}", delete(handlers::delete_order))
        .route("/api/settings", put(handlers::update_settings))
        .route("/api/stats", get(handlers::get_stats))
        .route("/api/upload", post(handlers::upload_image))
        .route("/api/auth/me", get(handlers::get_me))
        .layer(middleware::from_fn_with_state(db.clone(), auth_middleware));
    
    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])
        .allow_headers(Any);
    
    // Combine all routes with increased body limit for file uploads (100MB)
    let app = Router::new()
        .merge(public_routes)
        .merge(protected_routes)
        .nest_service("/uploads", ServeDir::new("uploads"))
        .layer(DefaultBodyLimit::max(100 * 1024 * 1024)) // 100MB limit
        .layer(cors)
        .with_state(db);
    
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    println!("🌐 Server listening on http://{}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

