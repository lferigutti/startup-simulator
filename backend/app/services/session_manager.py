from uuid import UUID

from sqlalchemy.orm import Session

from app.db import ScenarioResponseModel
from app.db.models import SessionModel
from app.models.enum import Role
from app.models.schemas import CreateSessionResponse, SessionResponse
from app.services.scenario_engine import get_first_scenario, get_total_scenarios, get_choice_traits, get_next_scenario
from app.services.roles import get_role_by_id
from app.models.session import ArchetypeMatch
from app.services import archetype_engine


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


def fetch_session(db: Session, session_id: UUID) -> SessionResponse | None:
    session = get_session_or_raise(db, session_id)
    role = Role(session.role)
    current_scenario = get_next_scenario(role, session.scenario_responses[-1].scenario_id) if session.scenario_responses else get_first_scenario(role)
    scenarios_completed = len(session.scenario_responses)
    total_scenarios = get_total_scenarios(role)
    is_completed = scenarios_completed >= total_scenarios
    return SessionResponse(
        sessionId=UUID(session.id),
        role=get_role_by_id(session.role),
        current_scenario=current_scenario,
        scenarios_completed=scenarios_completed,
        total_scenarios=total_scenarios,
        is_completed=is_completed
    )



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


def generate_trait_scores(db: Session, session_id: UUID) -> dict:
    """
    
    Raises:
        ValueError: If session not found
    """
    session = get_session_or_raise(db, session_id)
    
    # Aggregate traits from all scenario responses
    trait_counts = {}
    for response in session.scenario_responses:
        for trait in response.traits:
            trait_counts[trait] = trait_counts.get(trait, 0) + 1
    
    return trait_counts
    

def store_role_profile(db: Session, session_id: UUID, role_profile: ArchetypeMatch) -> None:
    """
    Store the generated role profile in the session.
    
    Raises:
        ValueError: If session not found
    """
    session = get_session_or_raise(db, session_id)
    session.role_profile = role_profile.model_dump()
    db.commit()


def get_role_profile(db: Session, session_id: UUID) -> ArchetypeMatch:
    """
    Retrieve the stored role profile for the session.
    
    Raises:
        ValueError: If session not found or profile not generated
    """
    session = get_session_or_raise(db, session_id)
    if session.role_profile is None:
        raise ValueError("Role profile not generated yet")
    return ArchetypeMatch.model_validate(session.role_profile)


def generate_role_profile(db: Session, session_id: UUID) -> ArchetypeMatch:
    """ Generate the role profile based on session decisions."""
    
    session = get_session_or_raise(db, session_id)
    role = Role(session.role)
    traits_scores = generate_trait_scores(db, session_id)
    role_profile = archetype_engine.get_top_archetype(role=role, trait_scores=traits_scores)

    if role_profile is None:
        raise ValueError("Could not generate role profile")

    return role_profile