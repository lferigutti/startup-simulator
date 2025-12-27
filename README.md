# Startup Simulator

Interactive role-based startup simulator that lets you “play” through realistic scenarios as a Founder, Product Manager, or Engineer. Your choices shape a trait profile and archetype that reflect how you tend to operate in a startup.

## Features

- Role selection: Founder, Product Manager, or Engineer.
- Scenario engine: branching, hand-crafted scenarios per role with meaningful trade‑offs.
- Trait scoring: choices map to traits like risk appetite, decision style, ownership, and communication.
- Archetype profiles: strengths, growth areas, and narrative feedback based on your choices.
- Single-container deployment: FastAPI backend and React/Vite SPA served from the same image.

## Tech Stack

- **Backend**: FastAPI, Pydantic, SQLAlchemy, SQLite, uv (Python dependency manager).
- **Frontend**: React, TypeScript, Vite, TanStack Router, TailwindCSS, shadcn/ui.
- **Infrastructure**: Docker (multi-stage build), optional deployment via Coolify.

## Project Structure

- `backend/` – FastAPI app, simulation engine, and data files.
  - `app/` – API, services, models, config.
  - `data/` – JSON data for roles, scenarios, and archetypes (no real user data).
  - `tests/` – pytest suite for services and API endpoints.
- `frontend/` – React/Vite SPA.
  - `src/` – routes, components, and UI logic.
  - `public/` – assets like `favicon.svg` (compass logo).

## Running Locally (Dev)

### Backend

```bash
cd backend
uv run main.py
```

This starts the API on `http://127.0.0.1:8000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and calls the local API.

## Docker & Single-Container Setup

The repo includes a multi-stage Dockerfile that builds the frontend and bundles it with the backend:

```bash
docker compose up --build -d
```

This will:

- Build the React app.
- Install backend dependencies using `uv`.
- Run `uvicorn` on port `8000` and serve the SPA (including client-side routes) from the same container.

Then open `http://localhost:8000`.

## Configuration

Backend settings are managed via environment variables (see `.env.example`):

- `ENVIRONMENT` – `local` | `staging` | `production` (controls docs exposure).
- `ENABLE_DOCS`, `ENABLE_OPENAPI` – toggle `/docs` and OpenAPI in non‑local envs.
- `ENABLE_CORS`, `CORS_ORIGINS` – CORS configuration (JSON array or comma‑separated list).
- `SERVER_PORT` / `PORT` – API port (default `8000`).

For the frontend, you can optionally set:

- `VITE_API_URL` – override API base URL; by default the SPA talks to `/api/v1` on the same origin.

## Deployment Notes

- Designed for platforms like **Coolify** where a single container serves both API and static frontend.
- Health checks can hit `/` on port `8000`.
- All sensitive values (CORS domains, ports, etc.) should be provided via platform env vars, not committed `.env` files.

## Testing

```bash
cd backend
uv run -m pytest
```

This runs the backend test suite (services + API-level tests).

---

## About This Project

This is a small experiment about how people make decisions in messy startup situations. It’s not a scientific test – it’s a reflection tool to surface patterns in your choices and spark more honest conversations about how you like to work.


## Contributing
Contributions are welcome! Please open issues or pull requests for bug fixes, improvements, or new scenarios.

## License

MIT © 2026 Leonardo Ferigutti