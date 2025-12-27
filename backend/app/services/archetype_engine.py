import json
from pathlib import Path
from typing import Dict, List, Optional

from app.models.enum import Role
from app.models.session import Archetype, ArchetypeMatch
from app.services.roles import get_role_by_id


# Path to archetype data files
ARCHETYPES_DIR = Path(__file__).resolve().parents[2] / "data" / "archetypes"

_archetypes_cache: Dict[Role, List[Archetype]] = {}



def _load_archetypes_for_role(role: Role) -> List[Archetype]:
    """Load archetypes from JSON file for a given role."""
    file_path = ARCHETYPES_DIR / f"{role.value}.json"

    if not file_path.exists():
        return []

    with open(file_path, "r") as f:
        content = f.read()
        if not content.strip():
            return []
        data = json.loads(content)

    archetypes: List[Archetype] = []
    for item in data:
        archetypes.append(
            Archetype(
                id=item["id"],
                role=get_role_by_id(Role(item["role"])),
                name=item["name"],
                key_traits=item["key_traits"],
                message=item["message"],
            )
        )

    return archetypes


def get_archetypes_for_role(role: Role) -> List[Archetype]:
    """Get all archetypes for a role (cached)."""
    if role not in _archetypes_cache:
        _archetypes_cache[role] = _load_archetypes_for_role(role)
    return _archetypes_cache[role]


def get_archetype_by_id(role: Role, archetype_id: str) -> Archetype | None:
    """Get a single archetype by id (e.g. 'engineer_craftsman')."""
    for archetype in get_archetypes_for_role(role):
        if archetype.id == archetype_id:
            return archetype
    return None


def get_archetype_by_name(role: Role, name: str) -> Archetype | None:
    """Get a single archetype by name (case-insensitive)."""
    wanted = name.strip().lower()
    for archetype in get_archetypes_for_role(role):
        if archetype.name.strip().lower() == wanted:
            return archetype
    return None



def generate_archetype_report(role: Role, trait_scores: Dict[str, int]) -> List[ArchetypeMatch]:
    """Rank archetypes for a role by how well trait_scores align.

    - score: sum of counts for the archetype's key_traits
    - coverage: proportion of key_traits that appear (non-zero) in trait_scores
    Returns detailed matches sorted by (score desc, coverage desc, name asc).
    """
    archetypes = get_archetypes_for_role(role)

    if not trait_scores:
        return []

    matches: List[ArchetypeMatch] = []
    for archetype in archetypes:
        matched = [t for t in archetype.key_traits if trait_scores.get(t, 0) > 0]
        missing = [t for t in archetype.key_traits if t not in matched]
        score = sum(trait_scores.get(t, 0) for t in matched)
        coverage = (len(matched) / len(archetype.key_traits)) if archetype.key_traits else 0.0

        matches.append(
            ArchetypeMatch(
                archetype=archetype,
                score=score,
                matched_traits=matched,
                missing_traits=missing,
                coverage=coverage,
            )
        )

    matches.sort(key=lambda m: (-m.score, -m.coverage, m.archetype.name))
    return matches


def get_top_archetype(role: Role, trait_scores: Dict[str, int]) -> Optional[ArchetypeMatch]:
    """Convenience: return the best matching archetype or None when no scores."""
    report = generate_archetype_report(role, trait_scores)
    return report[0] if report else None