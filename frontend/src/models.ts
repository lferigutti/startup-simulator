export interface Role {
  id: RoleId;
  name: string;
  description: string;
}
export type RoleId = "founder" | "engineer" | "marketer" | "designer" | "product-manager";

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
  first_scenario: Scenario;
  total_scenarios: number;
}

export interface DecideResponse {
  next_scenario: Scenario | null;
  scenarios_completed: number;
  total_scenarios: number;
  is_completed: boolean;
}