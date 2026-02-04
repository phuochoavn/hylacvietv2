use serde::{Deserialize, Serialize};

/// Product model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    pub id: String,
    pub name: String,
    #[serde(default)]
    pub description: String,
    pub price: i64,
    #[serde(default = "default_images")]
    pub images: Vec<String>,
    #[serde(default = "default_category")]
    pub category: String,
    #[serde(default = "default_status")]
    pub status: String,
    #[serde(default)]
    pub sort_order: i32,
    pub created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

fn default_images() -> Vec<String> {
    vec![]
}

fn default_category() -> String {
    "ao-dai".to_string()
}

fn default_status() -> String {
    "active".to_string()
}

#[derive(Debug, Deserialize)]
pub struct CreateProduct {
    pub name: String,
    #[serde(default)]
    pub description: String,
    pub price: i64,
    #[serde(default)]
    pub images: Vec<String>,
    #[serde(default = "default_category")]
    pub category: String,
    #[serde(default)]
    pub sort_order: i32,
}

#[derive(Debug, Deserialize)]
pub struct UpdateProduct {
    pub name: Option<String>,
    pub description: Option<String>,
    pub price: Option<i64>,
    pub images: Option<Vec<String>>,
    pub category: Option<String>,
    pub status: Option<String>,
    pub sort_order: Option<i32>,
}

/// Order model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: String,
    pub customer_name: String,
    pub customer_phone: String,
    #[serde(default)]
    pub customer_email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub product_id: Option<String>,
    #[serde(default)]
    pub product_name: String,
    #[serde(default)]
    pub measurements: String,
    #[serde(default)]
    pub notes: String,
    #[serde(default = "default_order_status")]
    pub status: String,
    pub created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

fn default_order_status() -> String {
    "pending".to_string()
}

#[derive(Debug, Deserialize)]
pub struct CreateOrder {
    pub customer_name: String,
    pub customer_phone: String,
    #[serde(default)]
    pub customer_email: String,
    pub product_id: Option<String>,
    #[serde(default)]
    pub product_name: String,
    #[serde(default)]
    pub measurements: String,
    #[serde(default)]
    pub notes: String,
}

#[derive(Debug, Deserialize)]
pub struct UpdateOrder {
    pub customer_name: Option<String>,
    pub customer_phone: Option<String>,
    pub customer_email: Option<String>,
    pub product_id: Option<String>,
    pub product_name: Option<String>,
    pub measurements: Option<String>,
    pub notes: Option<String>,
    pub status: Option<String>,
}

/// Setting model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Setting {
    pub key: String,
    pub value: String,
    #[serde(default = "default_setting_type")]
    pub r#type: String,
    pub updated_at: String,
}

fn default_setting_type() -> String {
    "string".to_string()
}

/// Category model
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: String,
    pub name: String,
    pub slug: String,
    #[serde(default)]
    pub icon: String,
    #[serde(default)]
    pub image: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub sort_order: i32,
    pub created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct CreateCategory {
    pub name: String,
    pub slug: String,
    #[serde(default)]
    pub icon: String,
    #[serde(default)]
    pub image: String,
    #[serde(default)]
    pub description: String,
    #[serde(default)]
    pub sort_order: i32,
}

#[derive(Debug, Deserialize)]
pub struct UpdateCategory {
    pub name: Option<String>,
    pub slug: Option<String>,
    pub icon: Option<String>,
    pub image: Option<String>,
    pub description: Option<String>,
    pub sort_order: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateSettings {
    pub settings: Vec<SettingUpdate>,
}

#[derive(Debug, Deserialize)]
pub struct SettingUpdate {
    pub key: String,
    pub value: String,
}

/// Admin user model
#[derive(Debug, Clone, Serialize)]
pub struct AdminUser {
    pub id: String,
    pub username: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub role: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_login: Option<String>,
    pub created_at: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct LoginResponse {
    pub token: String,
    pub user: AdminUserPublic,
}

#[derive(Debug, Serialize)]
pub struct AdminUserPublic {
    pub id: String,
    pub username: String,
    pub role: String,
}

/// JWT Claims
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub username: String,
    pub role: String,
    pub exp: usize,
    pub iat: usize,
}

/// API Response wrappers
#[derive(Debug, Serialize)]
pub struct ApiResponse<T> {
    pub success: bool,
    pub data: Option<T>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
}

impl<T> ApiResponse<T> {
    pub fn success(data: T) -> Self {
        Self {
            success: true,
            data: Some(data),
            message: None,
        }
    }

    pub fn error(message: &str) -> ApiResponse<()> {
        ApiResponse {
            success: false,
            data: None,
            message: Some(message.to_string()),
        }
    }
}

/// Stats for dashboard
#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub total_products: i64,
    pub active_products: i64,
    pub total_orders: i64,
    pub pending_orders: i64,
    pub recent_orders: Vec<Order>,
}

/// Pagination params
#[derive(Debug, Deserialize)]
pub struct PaginationParams {
    #[serde(default = "default_page")]
    pub page: u32,
    #[serde(default = "default_limit")]
    pub limit: u32,
    pub status: Option<String>,
    pub category: Option<String>,
}

fn default_page() -> u32 {
    1
}

fn default_limit() -> u32 {
    20
}

#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub total: i64,
    pub page: u32,
    pub limit: u32,
    pub total_pages: u32,
}
