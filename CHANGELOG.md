# Changelog

All notable changes to the **Foodstore** monorepo project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v2.2.0] - 2026-08-04

### Added
- **Redis 8.10 Integration**: Integrated `redis:8.10.0-trixie` with native `IRedisService` and `RedisService` in `.NET 10` infrastructure.
- **Redis 8.10 Compact Hashes (`HIMPORT`)**: Implemented schema-shared hash memory optimization reducing RAM overhead by 30%-60%.
- **CRM Realtime Leaderboard**: Implemented high-performance VIP customer ranking via Redis Sorted Sets (`crm:leaderboard:loyalty`) and endpoint `GET /v2/api/admin/customers/leaderboard`.
- **SignalR Redis Backplane**: Configured `AddStackExchangeRedis` for SignalR in `Program.cs` for multi-instance realtime order/kitchen broadcasting.
- **Token Blacklist & Revocation**: Added instant JWT token revocation on logout (`POST /v2/api/auth/logout`) checked in `JwtBearerEvents.OnTokenValidated`.
- **Encapsulated API Docker Stack**: Moved `docker-compose.yml`, `Dockerfile`, `.env`, and `.env.example` into `foodstore-api/` for isolated API stack containerization.
- **Individual Webapp Env Configs**: Added dedicated `.env` and `.env.example` to `foodstore-store`, `foodstore-admin`, and `foodstore-landingpage`.

### Changed
- Traefik proxy updated to `traefik:v3.7.10`.
- Simplified `docker-compose.yml` to 5 API stack containers (`traefik`, `db`, `redis`, `rustfs`, `api`).

### Removed
- Unused frontend `Dockerfile` and `.dockerignore` files from `foodstore-store`, `foodstore-admin`, and `foodstore-landingpage`.

---

## [v2.1.1] - 2026-07-23

### Fixed
- Fixed ESLint peer dependency warnings in `foodstore-admin`.
- Fixed TipTap rich text editor block extensions rendering.

---

## [v2.1.0] - 2026-07-15

### Added
- **E-Invoice Module**: Multi-provider electronic invoice system with Viettel & MISA integrations.
- **TipTap Rich Text Editor**: Added block-level content editing for CMS blog posts in Next.js admin dashboard.
- **ML.NET Sales Forecasting**: Integrated TimeSeries SSA sales prediction model in backend `ReportService`.

---

## [v2.0.0] - 2026-06-01

### Added
- Major release adding CMS blogging engine, CRM customer management, and Next.js 16 Admin Dashboard.
- Better Auth BFF integration with PostgreSQL and Drizzle ORM.

---

## [v1.4.0] - 2026-04-10

### Added
- Added RustFS (S3-compatible object storage) integration via AWS SDK.
- Support for VietQR code generation for POS orders.

---

## [v1.2.0] - 2026-02-18

### Added
- Kitchen Display System (KDS) realtime order status management via SignalR.

---

## [v1.1.0] - 2026-01-20

### Added
- POS menu management, combo discounts, and add-on selections.

---

## [v1.0.0] - 2026-01-05

### Added
- Initial release of Foodstore core backend (.NET 10 Clean Architecture) and POS frontend (SvelteKit 2 + Svelte 5).
