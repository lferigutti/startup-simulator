from contextlib import asynccontextmanager

from fastapi import  FastAPI
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


app : FastAPI = FastAPI(
  title=settings.TITLE,
  docs_url=settings.DOCS_URL if settings.ENABLE_DOCS else None,
  openapi_url=f"{settings.API_V1_STR}/{settings.OPENAPI_URL}" if settings.ENABLE_OPENAPI else None,
  lifespan=lifespan,
)

# if settings.all_cors_origins:
#   app.add_middleware(
#   CORSMiddleware,
#     allow_origins=settings.all_cors_origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
#   )

app.include_router(router=api_router, prefix=settings.API_V1_STR)