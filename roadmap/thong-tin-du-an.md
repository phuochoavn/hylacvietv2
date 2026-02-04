# Thông Tin Dự Án - Hỷ Lạc Việt v4

## Tổng Quan
Website thương mại cho thương hiệu áo dài & pháp phục cao cấp.
- **Domain**: https://hylacviet.vn
- **Admin**: https://admin.hylacviet.vn

---

## Công Nghệ

### Frontend (Customer Website)
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Astro** | 5.x | Static Site Generator, SSG |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **HTML5/CSS3** | - | Cấu trúc và styling |
| **Vanilla JS** | ES6+ | Interactivity, animations |

### Fonts
| Font | CDN | Sử dụng |
|------|-----|---------|
| **Noto Serif** | Google Fonts | Headings, thanh lịch |
| **Be Vietnam Pro** | Google Fonts | Body text, dễ đọc |

### Backend API
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Rust** | 1.88+ | Language |
| **Axum** | 0.8 | Web framework |
| **SQLx** | 0.8 | Database driver (async) |
| **PostgreSQL** | 16 | Database |
| **JWT** | - | Authentication |

### Admin Panel
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **SvelteKit** | 2.x | Full-stack framework |
| **Svelte** | 5.x | UI components |
| **TypeScript** | 5.x | Type safety |

### Infrastructure
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Docker** | - | Containerization |
| **Docker Compose** | - | Multi-container orchestration |
| **Traefik** | v2.11 | Reverse proxy, SSL, routing |
| **Let's Encrypt** | - | Free SSL certificates |
| **Nginx** | Alpine | Static file serving |

### Deployment
| Thành phần | Chi tiết |
|------------|----------|
| **VPS** | Linux server |
| **Domain** | hylacviet.vn |
| **SSL** | Auto via Traefik + Let's Encrypt |
| **Ports** | 80 (HTTP), 443 (HTTPS) |

---

## Kiến Trúc

```
┌─────────────────────────────────────────────────┐
│                  TRAEFIK v2.11                  │
│          (Reverse Proxy + SSL + Routing)        │
└─────────────────────────────────────────────────┘
           │              │              │
           ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Frontend   │  │   Backend   │  │    Admin    │
│   (Astro)   │  │   (Rust)    │  │ (SvelteKit) │
│   :80       │  │   :8080     │  │   :3000     │
└─────────────┘  └─────────────┘  └─────────────┘
                       │
                       ▼
              ┌─────────────────┐
              │   PostgreSQL    │
              │      :5432      │
              └─────────────────┘
```

---

## Cấu Trúc Thư Mục

```
/opt/hylacviet/
├── frontend/           # Astro customer website
│   ├── src/
│   │   ├── pages/      # .astro pages
│   │   ├── layouts/    # Layout components
│   │   └── styles/     # Global CSS
│   └── public/         # Static assets (images)
├── backend/            # Rust API
│   ├── src/
│   │   ├── main.rs
│   │   ├── handlers/
│   │   ├── models/
│   │   └── db/
│   └── Cargo.toml
├── admin/              # SvelteKit admin panel
│   ├── src/
│   │   └── routes/
│   └── package.json
├── docker-compose.yml  # Container orchestration
└── roadmap/            # Documentation
```

---

## Commands

```bash
# Build & deploy tất cả
docker compose up -d --build

# Chỉ frontend
docker compose up -d --build frontend

# Logs
docker compose logs -f frontend

# Restart
docker compose restart frontend
```

---

## Liên Hệ
- **Zalo**: 0912 50 3456
- **Email**: contact@hylacviet.vn
