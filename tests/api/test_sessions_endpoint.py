from uuid import UUID

from app.models.enum import Role
from app.services.scenario_engine import get_total_scenarios

class TestCreateSessionEndpoint:
    """Tests for the POST /api/v1/sessions/create endpoint."""

    def test_create_session_success(self, client):
        """Should return 200 and session data for valid role."""
        response = client.post("/api/v1/sessions/create?role=engineer")

        assert response.status_code == 200
        data = response.json()

        assert "sessionId" in data
        assert data["role"] == "engineer"
        assert "first_scenario" in data
        assert data["first_scenario"]["id"] == "engineer_scenario_1"
        assert data["total_scenarios"] >= 1

    def test_create_session_returns_valid_uuid(self, client):
        """Should return a valid UUID for sessionId."""
        response = client.post("/api/v1/sessions/create?role=engineer")
        data = response.json()

        # Should not raise - valid UUID
        session_uuid = UUID(data["sessionId"])
        assert session_uuid is not None

    def test_create_session_includes_scenario_choices(self, client):
        """Should include choices in the first scenario."""
        response = client.post("/api/v1/sessions/create?role=engineer")
        data = response.json()

        scenario = data["first_scenario"]
        assert "choices" in scenario
        assert len(scenario["choices"]) >= 2

        # Each choice should have required fields
        for choice in scenario["choices"]:
            assert "id" in choice
            assert "choice_text" in choice
            assert "traits" in choice

    def test_create_session_invalid_role(self, client):
        """Should return 422 for invalid role."""
        response = client.post("/api/v1/sessions/create?role=invalid_role")

        assert response.status_code == 422

    def test_create_session_missing_role(self, client):
        """Should return 422 when role is missing."""
        response = client.post("/api/v1/sessions/create")

        assert response.status_code == 422



class TestDecideEndpoint:
    """Tests for POST /api/v1/sessions/{session_id}/decide endpoint."""

    def test_decide_success_returns_next_scenario(self, client, db_session):
        """Should submit choice and return next scenario."""
        # Create session
        create_response = client.post("/api/v1/sessions/create?role=engineer")
        session_id = create_response.json()["sessionId"]
        
        # Submit first choice
        response = client.post(
            f"/api/v1/sessions/{session_id}/decide",
            params={
                "scenario_id": "engineer_scenario_1",
                "choice_id": "engineer_1_choice_1"
            }
        )
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["scenarios_completed"] == 1
        assert data["total_scenarios"] == get_total_scenarios(Role.ENGINEER)
        assert data["is_completed"] is False
        assert data["next_scenario"] is not None
        assert data["next_scenario"]["id"] == "engineer_scenario_2"

    def test_decide_last_scenario_marks_complete(self, client):
        """Should mark session as complete after last scenario."""
        # Create session
        create_response = client.post("/api/v1/sessions/create?role=engineer")
        session_id = create_response.json()["sessionId"]
        
        # Walk through scenarios until completion, always picking the first choice.
        scenario_id = "engineer_scenario_1"
        choice_id = "engineer_1_choice_1"
        response = None

        while True:
            response = client.post(
                f"/api/v1/sessions/{session_id}/decide",
                params={
                    "scenario_id": scenario_id,
                    "choice_id": choice_id,
                },
            )
            assert response.status_code == 200
            data = response.json()

            if data["next_scenario"] is None:
                assert data["is_completed"] is True
                assert data["scenarios_completed"] == data["total_scenarios"]
                break

            # Prepare next iteration: next scenario and its first choice.
            next_scenario = data["next_scenario"]
            scenario_id = next_scenario["id"]
            choice_id = next_scenario["choices"][0]["id"]

    def test_decide_invalid_session(self, client):
        """Should return 400 for non-existent session."""
        fake_id = "00000000-0000-0000-0000-000000000000"
        
        response = client.post(
            f"/api/v1/sessions/{fake_id}/decide",
            params={
                "scenario_id": "engineer_scenario_1",
                "choice_id": "engineer_1_choice_1"
            }
        )
        
        assert response.status_code == 400

    def test_decide_invalid_choice(self, client):
        """Should return 400 for invalid choice."""
        # Create session
        create_response = client.post("/api/v1/sessions/create?role=engineer")
        session_id = create_response.json()["sessionId"]
        
        # Submit invalid choice
        response = client.post(
            f"/api/v1/sessions/{session_id}/decide",
            params={
                "scenario_id": "engineer_scenario_1",
                "choice_id": "invalid_choice"
            }
        )
        
        assert response.status_code == 400
        assert "Invalid choice" in response.json()["detail"]

    def test_decide_tracks_progress(self, client):
        """Should correctly track progress through scenarios."""
        # Create session
        create_response = client.post("/api/v1/sessions/create?role=engineer")
        session_id = create_response.json()["sessionId"]
        
        # First decision
        response1 = client.post(
            f"/api/v1/sessions/{session_id}/decide",
            params={
                "scenario_id": "engineer_scenario_1",
                "choice_id": "engineer_1_choice_2"
            }
        )
        data1 = response1.json()
        assert data1["scenarios_completed"] == 1
        assert data1["total_scenarios"] == get_total_scenarios(Role.ENGINEER)
        
        # Second decision
        response2 = client.post(
            f"/api/v1/sessions/{session_id}/decide",
            params={
                "scenario_id": "engineer_scenario_2",
                "choice_id": "engineer_2_choice_3"
            }
        )
        data2 = response2.json()
        assert data2["scenarios_completed"] == 2
        assert data2["is_completed"] is (data2["scenarios_completed"] == data2["total_scenarios"])


class TestGenerateProfileEndpoint:
    """Tests for POST /sessions/{sesssion_id}/generate_profile endpoint."""

    def test_generate_profile_returns_top_archetype(self, client):
        # Create session
        create_response = client.post("/api/v1/sessions/create?role=engineer")
        session_id = create_response.json()["sessionId"]

        # Submit choices favoring The Craftsman (long_term, quality_focused, hands_on, independent)
        submissions = [
            ("engineer_scenario_1", "engineer_1_choice_1"),
            ("engineer_scenario_2", "engineer_2_choice_1"),
            ("engineer_scenario_6", "engineer_6_choice_1"),
        ]

        for scenario_id, choice_id in submissions:
            resp = client.post(
                f"/api/v1/sessions/{session_id}/decide",
                params={"scenario_id": scenario_id, "choice_id": choice_id},
            )
            assert resp.status_code == 200

        # Generate profile
        response = client.post(f"/api/v1/sessions/{session_id}/generate_profile")
        assert response.status_code == 200
        data = response.json()

        assert data["archetype"]["id"] == "engineer_craftsman"
        assert set(data["matched_traits"]).issuperset({"long_term", "quality_focused", "hands_on", "independent"})
        assert data["coverage"] > 0.0
        assert data["score"] > 0

    def test_generate_profile_invalid_session(self, client):
        fake_id = "00000000-0000-0000-0000-000000000000"
        response = client.post(f"/api/v1/sessions/{fake_id}/generate_profile")
        assert response.status_code == 400
        assert "not found" in response.json().get("detail", "").lower()
