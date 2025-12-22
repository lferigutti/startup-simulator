"""
Tests for session management endpoints and services.
"""
import pytest
from uuid import UUID

from app.models.enum import Role, WorkflowState
from app.db.models import SessionModel
from app.services import session_manager


class TestCreateSessionService:
    """Tests for the create_session service function."""

    def test_create_session_engineer(self, db_session):
        """Should create a session for engineer role."""
        response = session_manager.create_session(db_session, Role.ENGINEER)
        
        assert response.sessionId is not None
        assert response.role == Role.ENGINEER
        assert response.first_scenario is not None
        assert response.first_scenario.id == "engineer_scenario_1"
        assert response.total_scenarios == 2  # Based on current test data

    def test_create_session_stores_in_database(self, db_session):
        """Should persist session in database."""
        response = session_manager.create_session(db_session, Role.ENGINEER)
        
        # Query database directly
        stored_session = db_session.query(SessionModel).filter(
            SessionModel.id == str(response.sessionId)
        ).first()
        
        assert stored_session is not None
        assert stored_session.role == Role.ENGINEER.value
        assert stored_session.current_phase == WorkflowState.SCENARIOS.value

    def test_create_session_with_different_roles(self, db_session):
        """Should create sessions for different roles."""
        engineer_session = session_manager.create_session(db_session, Role.ENGINEER)
        
        assert engineer_session.role == Role.ENGINEER
        assert engineer_session.sessionId is not None


class TestGetSession:
    """Tests for session retrieval functions."""

    def test_get_session_exists(self, db_session):
        """Should return session when it exists."""
        # Create a session first
        created = session_manager.create_session(db_session, Role.ENGINEER)
        
        # Retrieve it
        session = session_manager.get_session(db_session, created.sessionId)
        
        assert session is not None
        assert session.id == str(created.sessionId)
        assert session.role == Role.ENGINEER.value

    def test_get_session_not_found(self, db_session):
        """Should return None for non-existent session."""
        fake_id = UUID("00000000-0000-0000-0000-000000000000")
        session = session_manager.get_session(db_session, fake_id)
        
        assert session is None

    def test_get_session_or_raise_exists(self, db_session):
        """Should return session when it exists."""
        created = session_manager.create_session(db_session, Role.ENGINEER)
        
        session = session_manager.get_session_or_raise(db_session, created.sessionId)
        
        assert session is not None

    def test_get_session_or_raise_not_found(self, db_session):
        """Should raise ValueError for non-existent session."""
        fake_id = UUID("00000000-0000-0000-0000-000000000000")
        
        with pytest.raises(ValueError) as exc_info:
            session_manager.get_session_or_raise(db_session, fake_id)
        
        assert "not found" in str(exc_info.value)


class TestSubmitChoice:
    """Tests for submitting scenario choices."""

    def test_submit_choice_success(self, db_session):
        """Should successfully submit a valid choice."""
        # Create session
        session_response = session_manager.create_session(db_session, Role.ENGINEER)
        
        # Submit first choice
        result = session_manager.submit_choice(
            db_session,
            session_response.sessionId,
            "engineer_scenario_1",
            "engineer_1_choice_1"
        )
        
        assert result is not None
        assert result.scenario_id == "engineer_scenario_1"
        assert result.choice_id == "engineer_1_choice_1"
        assert len(result.traits) > 0

    def test_submit_choice_stores_traits(self, db_session):
        """Should store traits with the choice."""
        session_response = session_manager.create_session(db_session, Role.ENGINEER)
        
        result = session_manager.submit_choice(
            db_session,
            session_response.sessionId,
            "engineer_scenario_1",
            "engineer_1_choice_1"
        )
        
        assert "long_term" in result.traits or "quality_focused" in result.traits

    def test_submit_choice_invalid_session(self, db_session):
        """Should raise error for non-existent session."""
        fake_id = UUID("00000000-0000-0000-0000-000000000000")
        
        with pytest.raises(ValueError) as exc_info:
            session_manager.submit_choice(
                db_session,
                fake_id,
                "engineer_scenario_1",
                "engineer_1_choice_1"
            )
        
        assert "not found" in str(exc_info.value)

    def test_submit_choice_invalid_choice_id(self, db_session):
        """Should raise error for invalid choice."""
        session_response = session_manager.create_session(db_session, Role.ENGINEER)
        
        with pytest.raises(ValueError) as exc_info:
            session_manager.submit_choice(
                db_session,
                session_response.sessionId,
                "engineer_scenario_1",
                "invalid_choice_id"
            )
        
        assert "Invalid choice" in str(exc_info.value)

    def test_submit_multiple_choices(self, db_session):
        """Should allow submitting multiple choices."""
        session_response = session_manager.create_session(db_session, Role.ENGINEER)
        
        # Submit first choice
        session_manager.submit_choice(
            db_session,
            session_response.sessionId,
            "engineer_scenario_1",
            "engineer_1_choice_1"
        )
        
        # Submit second choice
        result2 = session_manager.submit_choice(
            db_session,
            session_response.sessionId,
            "engineer_scenario_2",
            "engineer_2_choice_2"
        )
        
        assert result2.scenario_id == "engineer_scenario_2"
        
        # Check completion count
        completed = session_manager.get_scenarios_completed(db_session, session_response.sessionId)
        assert completed == 2


