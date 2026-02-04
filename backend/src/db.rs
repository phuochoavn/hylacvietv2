use rusqlite::{Connection, Result};
use std::sync::{Arc, Mutex};

pub type DbPool = Arc<Mutex<Connection>>;

pub fn init_db() -> Result<DbPool> {
    let conn = Connection::open("data/hylacviet.db")?;
    
    // Enable WAL mode for better concurrency
    conn.execute_batch("PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;")?;
    
    // Run schema
    let schema = include_str!("../schema.sql");
    conn.execute_batch(schema)?;
    
    Ok(Arc::new(Mutex::new(conn)))
}

pub fn parse_json_array(json: &str) -> Vec<String> {
    serde_json::from_str(json).unwrap_or_default()
}

pub fn to_json_array(arr: &[String]) -> String {
    serde_json::to_string(arr).unwrap_or_else(|_| "[]".to_string())
}
