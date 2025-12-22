from uuid import UUID

from sqlalchemy.orm import Session

from app.db import ScenarioResponseModel
from app.db.models import SessionModel
from app.models.enum import Role
from app.models.schemas import CreateSessionResponse
from app.services.scenario_engine import get_first_scenario, get_total_scenarios, get_choice_traits


def create_session(db: Session, role: Role) -> CreateSessionResponse:
    """
    Create a new simulation session for the given role.
    
    - Creates session record in database
    - Returns first scenario for the selected role
    """

    new_session = SessionModel(role=role.value)
    db.add(new_session)
    db.commit()
    db.refresh(new_session)
    

    first_scenario = get_first_scenario(role)
    total_scenarios = get_total_scenarios(role)
    
    return CreateSessionResponse(
        sessionId=UUID(new_session.id),
        role=role,
        first_scenario=first_scenario,
        total_scenarios=total_scenarios
    )


def get_session(db: Session, session_id: UUID) -> SessionModel | None:
    """Retrieve a session by ID."""
    return db.query(SessionModel).filter(SessionModel.id == str(session_id)).first()


def get_session_or_raise(db: Session, session_id: UUID) -> SessionModel:
    """Retrieve a session by ID, raise exception if not found."""
    session = get_session(db, session_id)
    if session is None:
        raise ValueError(f"Session {session_id} not found")
    return session


def get_scenarios_completed(db: Session, session_id: UUID) -> int:
    """Get the number of scenarios completed in the session."""
    session = get_session_or_raise(db, session_id)
    return len(session.scenario_responses)



def submit_choice(db: Session, session_id: UUID, scenario_id:str, choice_id: str) -> ScenarioResponseModel:
    """
    Submit a choice for the current scenario in the session.
    
    Raises:
        ValueError: If session not found or invalid choice
    """
    
    session = get_session_or_raise(db, session_id)

    role = Role(session.role)
    traits = get_choice_traits(role, scenario_id, choice_id)
    
    # Validate choice exists
    if not traits:
        raise ValueError(f"Invalid choice {choice_id} for scenario {scenario_id}")
    
    scenario_choice = ScenarioResponseModel(
        session_id=str(session_id),
        scenario_id=scenario_id,
        choice_id=choice_id,
        traits=traits
    )
    db.add(scenario_choice)
    db.commit()
    db.refresh(scenario_choice)
    return scenario_choice


