from app.models.enum import Role
from app.services.archetype_engine import (
    get_archetypes_for_role,
    get_archetype_by_id,
    get_archetype_by_name,
    generate_archetype_report,
    get_top_archetype,
)


def test_engineer_archetypes_load():
    archetypes = get_archetypes_for_role(Role.ENGINEER)
    assert len(archetypes) == 6
    assert {a.id for a in archetypes} >= {
        "engineer_craftsman",
        "engineer_firefighter",
        "engineer_team_player",
        "engineer_architect",
        "engineer_pragmatist",
        "engineer_challenger",
    }


def test_engineer_archetype_query_by_id_and_name():
    craftsman = get_archetype_by_id(Role.ENGINEER, "engineer_craftsman")
    assert craftsman is not None
    assert craftsman.name == "The Craftsman"

    by_name = get_archetype_by_name(Role.ENGINEER, "the craftsman")
    assert by_name is not None
    assert by_name.id == "engineer_craftsman"


def test_generate_archetype_report_ranks_by_score_and_coverage():
    scores = {
        "long_term": 2,
        "quality_focused": 2,
        "hands_on": 1,
        "independent": 1,
        "speed_focused": 1,
    }

    report = generate_archetype_report(Role.ENGINEER, scores)
    assert report, "Report should not be empty when scores are provided"

    # Top should be Craftsman (matches 4 traits, higher score)
    top = report[0]
    assert top.archetype.id == "engineer_craftsman"
    assert top.score == 6  # 2+2+1+1
    assert set(top.matched_traits) == {"long_term", "quality_focused", "hands_on", "independent"}

    # Firefighter should be lower because only one matching trait (speed_focused)
    firefighter = next(a for a in report if a.archetype.id == "engineer_firefighter")
    assert firefighter.score == 2  # speed_focused (1) + hands_on (1)
    assert {"speed_focused", "hands_on"}.issubset(set(firefighter.matched_traits))


def test_generate_archetype_report_empty_scores_returns_empty():
    assert generate_archetype_report(Role.ENGINEER, {}) == []


def test_get_top_archetype_helper():
    scores = {"confrontational": 2, "data_driven": 1, "independent": 1, "risk_taker": 1}
    top = get_top_archetype(Role.ENGINEER, scores)
    assert top is not None
    assert top.archetype.id == "engineer_challenger"


def test_founder_archetypes_load_and_query():
    archetypes = get_archetypes_for_role(Role.FOUNDER)
    assert len(archetypes) == 6
    ids = {a.id for a in archetypes}
    assert ids == {
        "founder_visionary",
        "founder_operator",
        "founder_fundraiser",
        "founder_product_builder",
        "founder_firefighter",
        "founder_people_first_leader",
    }

    visionary = get_archetype_by_id(Role.FOUNDER, "founder_visionary")
    assert visionary is not None
    assert visionary.name == "The Visionary"

    by_name = get_archetype_by_name(Role.FOUNDER, "the visionary")
    assert by_name is not None
    assert by_name.id == "founder_visionary"


def test_product_manager_archetypes_load_and_query():
    archetypes = get_archetypes_for_role(Role.PRODUCT_MANAGER)
    assert len(archetypes) == 6
    ids = {a.id for a in archetypes}
    assert ids == {
        "pm_data_strategist",
        "pm_visionary_storyteller",
        "pm_delivery_hacker",
        "pm_team_diplomat",
        "pm_user_champion",
        "pm_stakeholder_broker",
    }

    strategist = get_archetype_by_id(Role.PRODUCT_MANAGER, "pm_data_strategist")
    assert strategist is not None
    assert strategist.name == "The Data-Driven Strategist"

    by_name = get_archetype_by_name(Role.PRODUCT_MANAGER, "the data-driven strategist")
    assert by_name is not None
    assert by_name.id == "pm_data_strategist"
