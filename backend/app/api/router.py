from fastapi import APIRouter

from app.api.routes import sessions, roles


api_router = APIRouter()
api_router.include_router(router=sessions.router)
api_router.include_router(router=roles.router)