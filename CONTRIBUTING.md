# Contributing to Foodstore

First off, thank you for considering contributing to **Foodstore**!

This document provides guidelines and instructions for setting up your local environment, working on issues, submitting code changes, and adhering to project standards.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **.NET SDK**: `10.x`
- **Node.js**: `22.x` (LTS) or higher
- **Docker Desktop**: Version `27.x` or higher with Docker Compose `v2.x`
- **Git**: `2.40+`

---

## 🚀 Environment Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/qtuanph/foodstore.git
   cd foodstore
   ```

2. **Start API Stack Dependencies (PostgreSQL + Redis 8.10 + RustFS + API)**:
   ```bash
   cd foodstore-api
   cp .env.example .env
   docker compose up -d
   ```

3. **Run Frontend Webapps locally**:
   - **POS & Kitchen (`foodstore-store`)**:
     ```bash
     cd foodstore-store
     cp .env.example .env
     npm install
     npm run dev
     ```
   - **Admin Dashboard (`foodstore-admin`)**:
     ```bash
     cd foodstore-admin
     cp .env.example .env
     npm install
     npm run dev
     ```
   - **Landing Page (`foodstore-landingpage`)**:
     ```bash
     cd foodstore-landingpage
     cp .env.example .env
     npm install
     npm run dev
     ```

---

## 📐 Development Rules & Coding Standards

1. **Read Core Context**:
   Always read `AGENTS.md` and all files in `docs/` before making major structural or API changes.

2. **Backend (.NET 10)**:
   - Clean Architecture: Core → Usecase → Infrastructure → Web.
   - All business logic belongs in Usecase Services, not Controllers.
   - Register dependencies via layer DI extensions (`ServiceCollectionExtensions.cs`).
   - Run verification: `dotnet build foodstore-api` must pass with 0 Warnings and 0 Errors.

3. **Frontend (Svelte 5 / Next.js 16)**:
   - Svelte 5: Use runes (`$state()`, `$derived()`, `$effect()`).
   - Next.js 16: Use Server Components by default; `"use client"` only when interactive.
   - Run verification: `npm run build` or `npm run check`.

---

## 📌 Commit Message Conventions

Follow Conventional Commits:
- `feat`: A new feature (e.g., `feat(redis): add compact hash caching`)
- `fix`: A bug fix (e.g., `fix(auth): resolve token expiration edge case`)
- `docs`: Documentation only changes (e.g., `docs: update API endpoints`)
- `style`: Formatting, missing semi colons, no code change
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests
- `chore`: Maintenance tasks (deps updates, build scripts)

---

## 🔄 Pull Request Process

1. Create a feature branch: `git checkout -b feat/your-feature-name`.
2. Make your changes and verify all builds pass.
3. Commit your changes following commit conventions.
4. Push your branch to GitHub: `git push origin feat/your-feature-name`.
5. Open a Pull Request referencing the related Issue.
