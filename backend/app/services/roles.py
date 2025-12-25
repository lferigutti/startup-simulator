from typing import List
import json
from pathlib import Path

from app.models.enum import Role
from app.models.schemas import RoleResponse

def fetch_roles(
    include_details: bool = False
)-> List[RoleResponse]:

    roles_file = Path(__file__).parent.parent.parent / "data" / "roles" / "roles.json"
    with open(roles_file, "r") as f:
        roles_data = json.load(f)

    roles = []
    for role in roles_data:
        if include_details:
            roles.append(
                RoleResponse(
                    id=role["id"],
                    name=role["name"],
                    description=role["description"],
                )
            )
        else:
            roles.append(RoleResponse(id=role["id"])) 
    return roles
    

