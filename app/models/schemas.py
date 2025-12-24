
from pydantic import BaseModel
from uuid import UUID

from app.models.enum import Role
from app.models.session import Scenario, ArchetypeMatch


class CreateSessionResponse(BaseModel):
    sessionId: UUID
    role: Role
    first_scenario: Scenario
    total_scenarios: int


class DecideResponse(BaseModel):
    next_scenario: Scenario | None
    scenarios_completed: int
    total_scenarios: int
    is_completed: bool = False
