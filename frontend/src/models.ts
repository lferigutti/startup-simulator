export interface Role {
  id: RoleId;
  name: string;
  description: string;
}
export type RoleId = "founder" | "engineer" | "marketer" | "designer" | "product_manager";

export type Phase = "role-selection" | "scenarios" | "profile" | "reflection";

export interface Decision {
  scenarioId: number;
  choiceIndex: number;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Scenario {
    id: string;
    role: RoleId;
    title: string;
    description: string;
    choices: Choice[];
}

export interface Choice {
    id: string;
    scenarioId: string;
    choice_text: string;
    traits: string[];
}

export interface Session {
  sessionId: string;
  role: Role;
  current_scenario: Scenario | null;
  scenarios_completed: number;
  total_scenarios: number;
  is_completed: boolean;
}

export interface DecideResponse {
  next_scenario: Scenario | null;
  scenarios_completed: number;
  total_scenarios: number;
  is_completed: boolean;
}

export interface Archetype {
    id: string;
    role: Role;
    name: string;
    key_traits: string[];
    message: string;
    strengths?: string[];
    growth_areas?: string[];
}

export interface ArchetypeMatch {
    archetype: Archetype;
    score: number;
    matched_traits: string[];
    missing_traits: string[];
    coverage: number;
}
