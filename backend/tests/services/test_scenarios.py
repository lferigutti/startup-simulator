"""
Tests for the scenario engine service.
"""
import pytest

from app.models.enum import Role
from app.services.scenario_engine import (
    get_scenarios_for_role,
    get_first_scenario,
    get_total_scenarios,
    get_scenario_by_id,
    get_next_scenario,
    get_choice_traits,
)


class TestScenarioLoading:
    """Tests for scenario loading and caching."""

    def test_get_scenarios_for_engineer(self):
        """Should load engineer scenarios from JSON."""
        scenarios = get_scenarios_for_role(Role.ENGINEER)
        
        assert len(scenarios) >= 1
        assert all(s.role == Role.ENGINEER for s in scenarios)

    def test_get_first_scenario(self):
        """Should return the first scenario for a role."""
        scenario = get_first_scenario(Role.ENGINEER)
        
        assert scenario is not None
        assert scenario.id == "engineer_scenario_1"
        assert scenario.role == Role.ENGINEER

    def test_get_total_scenarios(self):
        """Should return correct count of scenarios."""
        total = get_total_scenarios(Role.ENGINEER)
        
        assert total >= 1


class TestScenarioNavigation:
    """Tests for scenario navigation."""

    def test_get_scenario_by_id(self):
        """Should return scenario by ID."""
        scenario = get_scenario_by_id(Role.ENGINEER, "engineer_scenario_1")
        
        assert scenario is not None
        assert scenario.id == "engineer_scenario_1"

    def test_get_scenario_by_id_not_found(self):
        """Should return None for non-existent scenario."""
        scenario = get_scenario_by_id(Role.ENGINEER, "nonexistent_scenario")
        
        assert scenario is None

    def test_get_next_scenario(self):
        """Should return next scenario in sequence."""
        next_scenario = get_next_scenario(Role.ENGINEER, "engineer_scenario_1")
        
        assert next_scenario is not None
        assert next_scenario.id == "engineer_scenario_2"

    def test_get_next_scenario_last(self):
        """Should return None when at last scenario."""
        # Get the last scenario ID
        scenarios = get_scenarios_for_role(Role.ENGINEER)
        last_scenario_id = scenarios[-1].id
        
        next_scenario = get_next_scenario(Role.ENGINEER, last_scenario_id)
        
        assert next_scenario is None


class TestChoiceTraits:
    """Tests for choice trait extraction."""

    def test_get_choice_traits(self):
        """Should return traits for a valid choice."""
        traits = get_choice_traits(
            Role.ENGINEER, 
            "engineer_scenario_1", 
            "engineer_1_choice_1"
        )
        
        assert len(traits) >= 1
        assert "long_term" in traits or "quality_focused" in traits

    def test_get_choice_traits_invalid_scenario(self):
        """Should return empty list for invalid scenario."""
        traits = get_choice_traits(
            Role.ENGINEER, 
            "nonexistent_scenario", 
            "some_choice"
        )
        
        assert traits == []

    def test_get_choice_traits_invalid_choice(self):
        """Should return empty list for invalid choice."""
        traits = get_choice_traits(
            Role.ENGINEER, 
            "engineer_scenario_1", 
            "nonexistent_choice"
        )
        
        assert traits == []
