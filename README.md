<div align="center">
  <h1>Foodstore 🍽️</h1>
  <p>
    <strong>Modern Restaurant Management & POS System</strong>
  </p>
  <p>
    A full-stack monorepo featuring a real-time Point of Sale, admin dashboard, CMS, CRM, kitchen display system, and machine learning-powered analytics.
  </p>

  <p>
    <img src="https://img.shields.io/badge/.NET-10.0-512BD4?logo=dotnet" alt=".NET 10">
    <img src="https://img.shields.io/badge/Svelte-5-FF3E00?logo=svelte" alt="Svelte 5">
    <img src="https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte" alt="SvelteKit 2">
    <img src="https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs" alt="Next.js 16">
    <img src="https://img.shields.io/badge/Astro-7-BC52EE?logo=astro" alt="Astro 7">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
    <img src="https://img.shields.io/badge/TypeScript-6|7-3178C6?logo=typescript" alt="TypeScript 6/7">
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4">
    <img src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql" alt="PostgreSQL 18">
    <img src="https://img.shields.io/badge/Redis-8.10-DC382D?logo=redis" alt="Redis 8.10">
    <img src="https://img.shields.io/badge/Traefik-v3.7.10-24D1C4?logo=traefik" alt="Traefik v3.7.10">
    <img src="https://img.shields.io/badge/Docker-2496ED?logo=docker" alt="Docker">
  </p>

  <br>
</div>

## Overview

Foodstore is a production-ready restaurant management platform designed for small to medium food & beverage businesses. It handles the entire order lifecycle — from POS ordering and kitchen display to admin management, CRM, and CMS with real-time updates via SignalR.

## Features

### Point of Sale (`/pos`)
- Intuitive menu browsing with categories, combos, and add-ons
- Cart management with discount code application
- Multiple payment methods: cash, QR (VietQR), ZaloPay, Momo, card
- Customer lookup by phone number
- Order history per session

### Kitchen Display System (`/kitchen`)
- Real-time order queue with automatic updates
- Status transitions: paid → preparing → served
- Sound notifications for new orders
- Kiosk-friendly layout for tablet/mounted displays

### Admin Dashboard (`/admin` on Next.js + shadcn)
- **Dashboard KPIs**: revenue, orders, customers, popular items
- **Analytics**: time-series charts, ML-powered sales forecasting, combo recommendations
- **Menu management**: categories, menu items, add-ons, combos with image upload
- **Order management**: full order lifecycle, status tracking, payment processing, refunds
- **Employee management**: staff accounts, role assignment, RBAC
- **Customer management (CRM)**: profiles, loyalty points, QR code, leaderboard
- **Discount codes**: percentage/fixed, usage limits, date ranges
- **CMS (Blog)**: rich text editor (TipTap), categories, tags, SEO, scheduling, revision history
- **Media gallery**: upload, usage tracking, unused image cleanup
- **Payment settings**: VietQR bank configuration
- **Sources/Tables**: order source management for dine-in

### Real-Time
- **SignalR hub** for live order updates, menu changes, table status, and kitchen notifications
- MessagePack protocol for efficient binary transport

### Machine Learning
- **Sales forecasting** using `Microsoft.ML.TimeSeries` (SSA estimation)
- **Combo recommendations** based on order co-occurrence analysis

## Tech Stack

### Frontend — foodstore-store (`foodstore-store/`)
| Technology | Purpose |
|---|---|
| **Svelte 5** + **SvelteKit 2** | UI framework with runes reactivity |
| **TypeScript 6** | Type-safe development |
| **Vite 8** (Rolldown/Oxc) | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **@iconify/svelte** | Tabler Icons via Iconify (275k+ icons, on-demand) |
| **Flowbite** | Vanilla JS UI components (programmatic API) |
| **TipTap** | Rich text editor for blog posts |
| **ApexCharts** | Interactive analytics charts |
| **Croppie** | Client-side image cropping |
| **SignalR** | Real-time WebSocket communication |
| **@sveltejs/adapter-node** | Node.js production server (Docker) |

### Frontend — foodstore-admin (`foodstore-admin/`)
| Technology | Purpose |
|---|---|
| **Next.js 16** + **React 19** | React framework with App Router |
| **shadcn/ui** (Base UI) | 55+ accessible UI components |
| **Tailwind CSS 4** | Utility-first styling |
| **lucide-react** | Icons |
| **next-themes** | Dark/light mode |
| **recharts** | Analytics charts |
| **sonner** | Toast notifications |
| **Better Auth** | BFF authentication with HttpOnly session cookies |

### Frontend — foodstore-landingpage (`foodstore-landingpage/`)
| Technology | Purpose |
|---|---|
| **Astro 7** | Static content site |
| **Tailwind CSS 4** | Utility-first styling |

### Backend — foodstore-api (`foodstore-api/`)
| Layer | Technology |
|---|---|
| **Core** | .NET 10, EF Core Abstractions |
| **Usecase** | BCrypt, JWT, ML.NET, StackExchangeRedis |
| **Infrastructure** | EF Core (PostgreSQL/Npgsql), AWS S3 SDK, Redis |
| **Web** | ASP.NET Core, SignalR, JWT Bearer, Rate Limiting |

### Database
- **PostgreSQL 18** with Vietnamese collation (`vi-VN-x-ICU`)
- 30+ tables covering the full restaurant domain model
- Entity Framework Core 10 with Npgsql provider

### Caching
- **Redis 8** — distributed cache (replaces legacy `IMemoryCache`)

### Media Storage
- **RustFS** (S3-compatible object storage)
- **AWS SDK for .NET** (`AWSSDK.S3`) for S3 API calls

### Reverse Proxy
- **Traefik** (latest) — single entry point, routes `/api/*` & `/hubs/*` to API, everything else to webapp

## Architecture

```
Internet (port 80)
     │
     ▼
┌──────────┐
│  Traefik  │  ← Reverse Proxy
└────┬─────┘
     │
     ├── host(localhost) ───────────► landingpage:4321 (Astro)
     ├── host(store.localhost) ─────► store:3000 (SvelteKit)
     ├── host(admin.localhost) ─────► admin:3000 (Next.js)
     ├── host(api.localhost) ───────► api:8080 (.NET 10)
     │
     └── /uploads/* ────────────────► rustfs:9000 (S3)
                                         │
                                 ┌────────┼────────┐
                                 ▼        ▼        ▼
                              db:5432  redis:6379  rustfs:9000
                            (PG 18)   (Redis 8)   (S3 Storage)
```

The backend follows **Clean Architecture** with 4 layers:
1. **Core** — domain entities (no dependencies)
2. **Usecase** — business logic, DTOs, service interfaces
3. **Infrastructure** — EF Core DbContext, repositories, S3, Redis
4. **Web** — controllers, middleware, SignalR hub

## Project Structure

```
foodstore/
├── foodstore-api/                   # Backend (.NET 10)
│   ├── FoodstoreApi.Core/           #   Domain entities (30+ entities)
│   ├── FoodstoreApi.Usecase/        #   Business logic & DTOs
│   ├── FoodstoreApi.Infrastructure/ #   EF Core, S3, Redis, Migrations
│   ├── Dockerfile                  #   Docker image
│   └── FoodstoreApi.Web/            #   25 API controllers, hubs
├── foodstore-store/                 # POS & Kitchen (SvelteKit)
│   ├── Dockerfile
│   ├── src/
│   │   ├── lib/
│   │   │   ├── api/                #   API client modules
│   │   │   ├── components/         #   Base UI components
│   │   │   ├── types/
│   │   │   ├── utils/
│   │   │   └── config/
│   │   └── routes/
│   │       ├── pos/                #   Point of Sale
│   │       ├── kitchen/            #   Kitchen display
│   │       └── admin/              #   Legacy admin (SvelteKit)
├── foodstore-admin/                 # Admin Dashboard (Next.js + shadcn)
│   ├── Dockerfile
│   ├── src/
│   │   ├── app/admin/
│   │   │   ├── cms/                #   CMS module (posts, categories, tags, settings)
│   │   │   ├── crm/                #   CRM module (customers, leaderboard)
│   │   │   ├── employees/          #   Employee management
│   │   │   └── food/               #   Menu & orders management
│   │   ├── components/             #   shadcn/ui + custom components
│   │   └── lib/                    #   Auth, API client, services
├── foodstore-landingpage/           # Landing Page (Astro)
├── docker-compose.yml               # Full stack orchestration
├── .env                             # Environment variables
├── .env.example                     # Environment template
└── docs/
```

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com) + Docker Compose
- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0) (local dev)
- [Node.js 22+](https://nodejs.org) (local dev)

### 1. Quick Start (Docker — Recommended)

```bash
# Clone & start full stack
git clone https://github.com/qtuanph/foodstore.git
cd foodstore

# Full stack: 8 services
docker compose up -d
```

| URL | Service |
|-----|---------|
| `http://localhost` | Landing page (Astro) |
| `http://store.localhost` | POS + Kitchen + Legacy Admin (SvelteKit) |
| `http://admin.localhost` | Admin Dashboard (Next.js + shadcn) |
| `http://api.localhost` | API (Swagger UI) |

### 1. API Stack Quickstart (Docker Compose)

```bash
cd foodstore-api
docker compose up -d
```

| Service | Image | Internal Port | Host (Traefik) |
|---------|-------|--------------|----|
| **traefik** | `traefik:v3.7.10` | `:8080` | — |
| **db** | `postgres:18.4-trixie` | `:5432` | — |
| **redis** | `redis:8.10.0-trixie` | `:6379` | — |
| **rustfs** | `rustfs/rustfs:latest` | `:9000` (S3) | uploads.localhost |
| **api** | `foodstore-api` (build) | `:8080` | api.localhost |

### 2. Local Development (without Docker)

```bash
# Terminal 1 — API Stack Dependencies (PostgreSQL + Redis 8.10 + RustFS)
cd foodstore-api
docker compose up -d db redis rustfs

# Terminal 2 — Backend API
cd foodstore-api
dotnet run --project FoodstoreApi.Web   # http://localhost:5142

# Terminal 3 — foodstore-store (Self-hosted)
cd foodstore-store
npm install && npm run dev              # http://localhost:5173

# Terminal 4 — foodstore-admin (Self-hosted)
cd foodstore-admin
npm install && npm run dev              # http://localhost:3000

# Terminal 5 — foodstore-landingpage (Self-hosted)
cd foodstore-landingpage
npm install && npm run dev              # http://localhost:4321
```

## API Proxy

Next.js admin routes all API calls through a proxy:
- `/api/proxy/:path*` → `http://api:8080/v2/api/:path*`
- `/api/proxy/hubs/:path*` → `http://api:8080/hubs/:path*` (SignalR)

## Deployment

```bash
docker compose up -d
```

### Roadmap
- [x] Docker Compose (Traefik + PostgreSQL + Redis + RustFS + API + 3 Frontends)
- [x] Monorepo with 4 sub-projects (API, Store, Admin, Landing)
- [x] CMS system (Blog, Categories, Tags, SEO, Scheduling, Revisions)
- [x] CRM module (Customer management, Loyalty points, Leaderboard)
- [ ] Customer mobile ordering via QR code
- [ ] Multi-branch/outlet support
- [ ] Offline POS mode
- [ ] Inventory management
- [ ] Supplier management
- [ ] E-invoice integration
- [ ] i18n (Vietnamese/English)
- [ ] PWA support
