from fastapi import APIRouter

from app.api.routes import sessions


api_router = APIRouter()
api_router.include_router(router=sessions.router)
