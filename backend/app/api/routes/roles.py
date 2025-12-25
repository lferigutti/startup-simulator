from fastapi import APIRouter
from typing import List

from app.models.schemas import RoleResponse
from app.services.roles import fetch_roles


router = APIRouter(tags=["Roles"], prefix="/roles")

@router.get("", summary="Roles Root Endpoint", response_model_exclude_none=True)
def get_roles(
    include_details: bool = True
)-> List[RoleResponse]:
    roles = fetch_roles(include_details=include_details)
    return roles

