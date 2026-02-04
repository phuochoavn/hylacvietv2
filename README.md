# Hỷ Lạc Việt v4

Áo Dài & Pháp Phục Cao Cấp - Full Stack Web Application

## Stack
- **Backend**: Rust (Axum) + SQLite
- **Frontend**: Astro
- **Admin**: Vue 3 + TailwindCSS
- **Deploy**: Docker + Traefik + Let's Encrypt

## Quick Start

### 1. VPS Setup
```bash
chmod +x setup-vps.sh
./setup-vps.sh
```

### 2. Start Traefik
```bash
cd traefik
docker compose up -d
```

### 3. Deploy Application
```bash
docker compose up -d --build
```

## URLs
- **Website**: https://hylacviet.vn
- **Admin**: https://admin.hylacviet.vn (admin / admin123)
- **API**: https://hylacviet.vn/api

## Development

### Backend
```bash
cd backend
cargo run
# Runs on http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:4321
```

### Admin
```bash
cd admin
npm install
npm run dev
# Runs on http://localhost:5173
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /health | ❌ | Health check |
| GET | /api/products | ❌ | List products |
| GET | /api/products/:id | ❌ | Get product |
| POST | /api/products | ✅ | Create product |
| PUT | /api/products/:id | ✅ | Update product |
| DELETE | /api/products/:id | ✅ | Delete product |
| GET | /api/orders | ✅ | List orders |
| POST | /api/orders | ❌ | Create order |
| PUT | /api/orders/:id | ✅ | Update order |
| DELETE | /api/orders/:id | ✅ | Delete order |
| GET | /api/settings | ❌ | Get settings |
| PUT | /api/settings | ✅ | Update settings |
| POST | /api/auth/login | ❌ | Admin login |
| POST | /api/upload | ✅ | Upload image |
| GET | /api/stats | ✅ | Dashboard stats |

## License

Private - All rights reserved
