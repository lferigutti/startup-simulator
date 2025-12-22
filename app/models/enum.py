from enum import Enum


class Role(str, Enum):
    ENGINEER = "engineer"
    PRODUCT_MANAGER = "product_manager"
    FOUNDER = "founder"


class WorkflowState(str, Enum):
    SCENARIOS = "scenarios"
    PROFILE_GENERATION = "profile_generation"
    REFLECTION = "reflection"
