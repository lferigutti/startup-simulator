from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.router import api_router
from app.db.database import engine
from app.db.models import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create database tables on startup."""
    Base.metadata.create_all(bind=engine)
    yield


docs_enabled = settings.ENABLE_DOCS and settings.ENVIRONMENT != "production"
openapi_enabled = settings.ENABLE_OPENAPI and settings.ENVIRONMENT != "production"


app: FastAPI = FastAPI(
    title=settings.TITLE,
    docs_url=settings.DOCS_URL if docs_enabled else None,
    openapi_url=f"{settings.API_V1_STR}/{settings.OPENAPI_URL}" if openapi_enabled else None,
    lifespan=lifespan,
)

if settings.all_cors_origins:
  app.add_middleware(
  CORSMiddleware,
    allow_origins=settings.all_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
  )

app.include_router(router=api_router, prefix=settings.API_V1_STR)

# Serve built frontend (Vite dist) as static files from the "static" directory
# Only mount if the static directory exists (i.e., in production/Docker)
STATIC_DIR = Path(__file__).parent.parent / "static"
if STATIC_DIR.exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        """Serve index.html for any non-API route (SPA fallback)."""
        file_path = STATIC_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(STATIC_DIR / "index.html")