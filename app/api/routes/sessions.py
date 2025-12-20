from fastapi import APIRouter

router = APIRouter(tags=["Sessions"], prefix="/sessions")

@router.get("/", summary="Sessions Root Endpoint")
async def read_root():
    return {"message": "Welcome to the Sessions Endpoint!"}