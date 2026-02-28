# Thông Tin Dự Án - Hỷ Lạc Việt

## Tổng Quan
Website thương mại cho thương hiệu áo dài & pháp phục cao cấp.
- **Domain**: https://hylacviet.vn
- **Admin**: https://admin.hylacviet.vn

---

## Công Nghệ

### Frontend (Customer Website)
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Next.js** | 14 (App Router) | SSR/SSG Framework |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Framer Motion** | 11.x | Animations |
| **Swiper** | 11.x | Carousel/Slider |
| **CSS Vanilla** | - | Styling (Design System) |

### Fonts
| Font | Nguồn | Sử dụng |
|------|-------|---------|
| **Cormorant Garamond** | next/font (Google) | Headings |
| **Roboto** | next/font (Google) | Body text |
| **Cotta Free** | Custom @font-face | Brand name |

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
| **Vue** | 3.x | UI framework |
| **Vite** | 5.x | Build tool |
| **TypeScript** | 5.x | Type safety |

### Infrastructure
| Công nghệ | Phiên bản | Mục đích |
|-----------|-----------|----------|
| **Docker** | - | Containerization |
| **Docker Compose** | - | Multi-container orchestration |
| **Traefik** | v2.11 | Reverse proxy, SSL, routing |
| **Let's Encrypt** | - | Free SSL certificates |

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
│  (Next.js)  │  │   (Rust)    │  │   (Vue 3)   │
│   :3001     │  │   :3000     │  │   :80       │
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
├── frontend/           # Next.js 14 customer website
│   ├── src/
│   │   ├── app/        # App Router pages
│   │   ├── components/ # React components
│   │   ├── lib/        # Constants, utilities
│   │   └── styles/     # CSS files
│   └── public/         # Static assets (images, fonts)
├── backend/            # Rust API (Axum)
│   ├── src/
│   │   ├── main.rs
│   │   ├── handlers/
│   │   ├── models/
│   │   └── db/
│   └── Cargo.toml
├── admin/              # Vue 3 admin panel
│   ├── src/
│   │   └── views/
│   └── package.json
├── docker-compose.yml  # Container orchestration
├── traefik/            # Traefik config
└── roadmap/            # Documentation
    ├── thong-tin-du-an.md
    ├── roadmap.md
    ├── nhat-ky.md
    ├── spec-driven.md
    └── _archive/
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
- **Zalo**: 0912 503 456
- **Email**: contact@hylacviet.vn

---

*Cập nhật: Sprint SEO — 2026-02-28*
