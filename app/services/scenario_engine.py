import json
from pathlib import Path
from typing import Dict, List

from app.models.enum import Role
from app.models.session import Scenario, Choice


# Path to scenario data files
SCENARIOS_DIR = Path(__file__).resolve().parents[2] / "data" / "scenarios"

# In-memory cache of loaded scenarios (loaded once at startup)
_scenarios_cache: Dict[Role, List[Scenario]] = {}


def _load_scenarios_for_role(role: Role) -> List[Scenario]:
    """Load scenarios from JSON file for a given role."""
    file_path = SCENARIOS_DIR / f"{role.value}.json"
    
    if not file_path.exists():
        return []
    
    with open(file_path, "r") as f:
        content = f.read()
        if not content.strip():
            return []
        data = json.loads(content)
    
    scenarios_with_order = []
    for scenario_data in data:
        choices = [
            Choice(
                id=choice["id"],
                scenario_id=scenario_data["id"],
                choice_text=choice["text"],
                traits=choice["traits"]
            )
            for choice in scenario_data["choices"]
        ]
        
        scenario = Scenario(
            id=scenario_data["id"],
            role=Role(scenario_data["role"]),
            title=scenario_data["title"],
            description=scenario_data["description"],
            choices=choices
        )
        scenarios_with_order.append((scenario_data.get("order", 0), scenario))
    
    # Sort by order field if present (stable)
    scenarios_with_order.sort(key=lambda pair: pair[0])

    return [scenario for _, scenario in scenarios_with_order]


def get_scenarios_for_role(role: Role) -> List[Scenario]:
    """Get all scenarios for a role (cached)."""
    if role not in _scenarios_cache:
        _scenarios_cache[role] = _load_scenarios_for_role(role)
    return _scenarios_cache[role]


def get_first_scenario(role: Role) -> Scenario | None:
    """Get the first scenario for a role."""
    scenarios = get_scenarios_for_role(role)
    return scenarios[0] if scenarios else None


def get_total_scenarios(role: Role) -> int:
    """Get total number of scenarios for a role."""
    return len(get_scenarios_for_role(role))


def get_scenario_by_id(role: Role, scenario_id: str) -> Scenario | None:
    """Get a specific scenario by ID."""
    scenarios = get_scenarios_for_role(role)
    for scenario in scenarios:
        if scenario.id == scenario_id:
            return scenario
    return None


def get_next_scenario(role: Role, current_scenario_id: str) -> Scenario | None:
    """Get the next scenario after the current one."""
    scenarios = get_scenarios_for_role(role)
    for i, scenario in enumerate(scenarios):
        if scenario.id == current_scenario_id:
            if i + 1 < len(scenarios):
                return scenarios[i + 1]
            return None
    return None


def get_choice_traits(role: Role, scenario_id: str, choice_id: str) -> List[str]:
    """Get traits for a specific choice."""
    scenario = get_scenario_by_id(role, scenario_id)
    if scenario:
        for choice in scenario.choices:
            if choice.id == choice_id:
                return choice.traits
    return []
