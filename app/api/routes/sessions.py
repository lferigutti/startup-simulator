from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID

from app.db.database import get_db
from app.models.enum import Role
from app.models.schemas import CreateSessionResponse, DecideResponse
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
    return session_manager.create_session(db, role)


@router.get("/{session_id}", summary="Retrieve session details by ID")
def get_session_endpoint(
    session_id: UUID,
    db: Session = Depends(get_db)
):
    session = session_manager.get_session(db, session_id)
    if session is None:
        return {"error": "Session not found"}
    return session


@router.post("/{session_id}/decide", summary="Submit a choice for the current scenario")
def submit_choice_endpoint(
    session_id: UUID,
    scenario_id: str,
    choice_id: str,
    db: Session = Depends(get_db)
):
    try:
        # Sumit the choice using the session manager
        session_manager.submit_choice(db, session_id, scenario_id, choice_id)

        # Get next scenario
        session = session_manager.get_session_or_raise(db, session_id)
        role = Role(session.role)
        next_scenario = scenario_engine.get_next_scenario(role, scenario_id)
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


@router.post("/{sesssion_id}/generate_profile", summary="Generate user profile based on decisions")
def generate_profile_endpoint(
    sesssion_id: UUID,
    db: Session = Depends(get_db)
)-> ArchetypeMatch:
    try:
        session = session_manager.get_session_or_raise(db, sesssion_id)
        role = Role(session.role)
        traits_scores = session_manager.generate_trait_scores(db, sesssion_id)
        return archetype_engine.get_top_archetype(role=role, trait_scores=traits_scores)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal Server Error")