export type Role = "engineer" | "product-manager" | "founder";

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
