from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.database import get_db
from app.models.enum import Role
from app.models.schemas import CreateSessionResponse, DecideRequest, DecideResponse, SessionResponse
from app.models.session import ArchetypeMatch
from app.services import session_manager, scenario_engine, archetype_engine

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
    elif role == Role.PRODUCT_MANAGER or role == Role.FOUNDER:
        raise HTTPException(status_code=400, detail=f"Role {role.value} is not yet supported")
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

        return DecideResponse(
            next_scenario=next_scenario,
            scenarios_completed=scenarios_completed,
            total_scenarios=scenario_engine.get_total_scenarios(role),
            is_completed=next_scenario is None
        )

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/{session_id}/generate_profile", summary="Generate user profile based on decisions")
def generate_profile_endpoint(
    session_id: UUID,
    db: Session = Depends(get_db)
)-> ArchetypeMatch:
    try:
        session = session_manager.get_session_or_raise(db, session_id)
        role = Role(session.role)
        traits_scores = session_manager.generate_trait_scores(db, session_id)
        return archetype_engine.get_top_archetype(role=role, trait_scores=traits_scores)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")