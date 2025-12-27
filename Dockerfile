## Stage 1: Build frontend (Vite)
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

## Stage 2: Backend + static files (uv + pyproject)
FROM ghcr.io/astral-sh/uv:python3.13-bookworm-slim AS backend

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    UV_NO_DEV=1

WORKDIR /app

# Install backend dependencies from lockfile/pyproject
COPY backend/pyproject.toml ./pyproject.toml
COPY backend/uv.lock ./uv.lock
RUN uv sync --frozen

# Copy backend code
COPY backend/app ./app
COPY backend/main.py ./main.py
COPY backend/data ./data

# Copy built frontend into the location FastAPI serves from
COPY --from=frontend-build /app/frontend/dist ./static

# Ensure the project environment is on PATH so uvicorn is found
ENV PATH="/app/.venv/bin:$PATH"

# Create non-root user and own files
RUN addgroup --system app && adduser --system --ingroup app app && chown -R app:app /app
USER app


EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
