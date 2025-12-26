
from typing import Optional
from pydantic import BaseModel
from uuid import UUID

from app.models.enum import Role
from app.models.session import Scenario


class CreateSessionResponse(BaseModel):
    sessionId: UUID
    role: Role
    first_scenario: Scenario
    total_scenarios: int


class SessionResponse(BaseModel):
    sessionId: UUID
    role: Role
    current_scenario: Optional[Scenario] = None
    scenarios_completed: int
    total_scenarios: int
    is_completed: bool = False

class DecideRequest(BaseModel):
    scenario_id: str
    choice_id: str


class DecideResponse(BaseModel):
    next_scenario: Scenario | None
    scenarios_completed: int
    total_scenarios: int
    is_completed: bool = False


class RoleResponse(BaseModel):
    id: str
    name: Optional[str] = None
    description: Optional[str] = None