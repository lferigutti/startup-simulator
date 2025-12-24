from uuid import UUID
from typing import List

from pydantic import BaseModel
from datetime import datetime

from app.models.enum import Role, WorkflowState


class Choice(BaseModel):
    id: str
    scenario_id: str
    choice_text: str
    traits: List[str]


class Scenario(BaseModel):
    id: str
    role: Role
    title: str
    description: str
    choices: List[Choice]


class Session(BaseModel):
    session_id: UUID
    role: Role
    created_at: datetime
    updated_at: datetime
    current_phase: WorkflowState
    scenarios_completed: List[Scenario]



class Archetype(BaseModel):
    id: str
    role: Role
    name: str
    key_traits: List[str]
    message: str


class ArchetypeMatch(BaseModel):
    archetype: Archetype
    score: int
    matched_traits: List[str]
    missing_traits: List[str]
    coverage: float