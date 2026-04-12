# Project High Level Requirements
See [Log](log.md) for the planning mode prompt and subsequent prompts.

# Planned work
See [Tasks](tasks.md) for a series of stories and tasks for the project.

# Coding Practices
## Testing
- All production code should have a unit test
- For backend, use assertj library for assertions over hamcrest or built in junit.

## Linting
- When writing new code please run linting tasks and ensure new code is compatible with linting standard.
- For backend use `./gradlew ktlintCheck` and `./gradlew ktlintFormat` for fixing some style problems.
- For Frontend please use `npm run lint`

# Docker compose test stack
```
pgcli postgres://purchaseai:purchaseai@localhost:5432/purchaseai
```

# Backend (backend/)
- Spring Boot 3.2 + Kotlin + Hibernate + Spring Security + JWT (jjwt 0.12)
- Flyway migrations: users, purchase_types, purchases tables
- POST /auth/register + POST /auth/login → JWT
- Full CRUD on /api/purchase-types (delete blocked with 409 if in use)
- Full CRUD on /api/purchases (paginated, sorted by date desc)

# Frontend (frontend/)
- React 18 + Vite + Tailwind
- Login/Register page, protected routes
- Purchases page: paginated table, modal form for create/edit/delete
- Purchase Types page: inline create/edit/delete

# Infra (docker-compose.yml)
- Postgres 16 with health check
- Backend on port 8080, frontend (nginx) on port 3000
- nginx proxies /api/ and /auth/ to backend

To run:
```bash
docker compose up --build
```
Then open http://localhost:3000, register a user, and start adding purchases.

For local dev (no Docker):
# terminal 1 — needs postgres running locally
`cd backend && ./gradlew bootRun`

# terminal 2
`cd frontend && npm install && npm run dev`
# frontend at http://localhost:5173
