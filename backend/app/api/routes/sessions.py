from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.database import get_db
from app.models.enum import Role
from app.models.schemas import CreateSessionResponse, DecideRequest, DecideResponse, SessionResponse
from app.services import session_manager, scenario_engine, archetype_engine
from app.models.session import ArchetypeMatch

router = APIRouter(tags=["Sessions"], prefix="/sessions")

@router.get("/", summary="Sessions Root Endpoint")
async def read_root():
    return {"message": "Welcome to the Sessions Endpoint!"}


@router.post("/create", summary="Initialize a new simulation session")
def create_session_endpoint(
    role: Role,
    db: Session = Depends(get_db) 
) -> CreateSessionResponse:

    if role not in Role:
        raise HTTPException(status_code=400, detail="Invalid role specified")
    return session_manager.create_session(db, role)


@router.get("/{session_id}", summary="Retrieve session details by ID")
def get_session_endpoint(
    session_id: UUID,
    db: Session = Depends(get_db)
)-> SessionResponse:
    session = session_manager.fetch_session(db, session_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


@router.post("/{session_id}/decide", summary="Submit a choice for the current scenario")
def submit_choice_endpoint(
    session_id: UUID,
    body: DecideRequest,
    db: Session = Depends(get_db)
)-> DecideResponse:
    try:
        # Sumit the choice using the session manager
        session_manager.submit_choice(db, session_id, body.scenario_id, body.choice_id)

        # Get next scenario
        session = session_manager.get_session_or_raise(db, session_id)
        role = Role(session.role)
        next_scenario = scenario_engine.get_next_scenario(role, body.scenario_id)
        scenarios_completed = session_manager.get_scenarios_completed(db, session_id)

        if next_scenario is None:
            try:
                # Generate and store role profile
                role_profile = session_manager.generate_role_profile(db, session_id)
                session_manager.store_role_profile(db, session_id, role_profile)
            except ValueError:
                pass  # Profile generation failure should not block scenario progression

        return DecideResponse(
            next_scenario=next_scenario,
            scenarios_completed=scenarios_completed,
            total_scenarios=scenario_engine.get_total_scenarios(role),
            is_completed=next_scenario is None
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/{session_id}/profile", summary="Generate user profile based on decisions")
def generate_profile_endpoint(
    session_id: UUID,
    db: Session = Depends(get_db)
)-> str:
    try:
        role_profile = session_manager.generate_role_profile(db, session_id)
        session_manager.store_role_profile(db, session_id, role_profile)
        return "OK"
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    

@router.get("/{session_id}/profile", summary="Retrieve the generated role profile for the session")
def get_role_profile_endpoint(
    session_id: UUID,
    db: Session = Depends(get_db)
)-> ArchetypeMatch:
    try:
        return session_manager.get_role_profile(db, session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

