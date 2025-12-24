import { useState } from "react";
import RoleSelection from "@/components/sections/RoleSelection.tsx";
import ScenarioView from "@/components/sections/scenarios/ScenarioView.tsx";
import ProfileView from "@/components/sections/profile-view/ProfileView.tsx";
import ReflectionChat from "@/components/sections/reflection-chart/ReflectionChart.tsx";
import type { Role, Phase} from "@/models"


export interface Decision {
  scenarioId: number;
  choiceIndex: number;
}

export default function HomePage() {
  const [phase, setPhase] = useState<Phase>("role-selection");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  const handleRoleSelect = async (role: Role) => {
    setSelectedRole(role);
    // In a real app, call API to create session
    setSessionId(`session-${Date.now()}`);
    setPhase("scenarios");
  };
  console.log(selectedRole,  decisions);
  
  const handleScenarioComplete = (allDecisions: Decision[]) => {
    setDecisions(allDecisions);
    setPhase("profile");
  };

  const handleStartReflection = () => {
    setPhase("reflection");
  };

  const handleRestart = () => {
    setPhase("role-selection");
    setSelectedRole(null);
    setDecisions([]);
    setSessionId("");
  };

  return (
    <main className="min-h-screen bg-background">
      {phase === "role-selection" && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}

      {phase === "scenarios" && selectedRole && (
        <ScenarioView
          role={selectedRole}
          sessionId={sessionId}
          onComplete={handleScenarioComplete}
        />
      )}

      {phase === "profile" && selectedRole && (
        <ProfileView
          role={selectedRole}
          decisions={decisions}
          onStartReflection={handleStartReflection}
          onRestart={handleRestart}
        />
      )}

      {phase === "reflection" && selectedRole && (
        <ReflectionChat
          role={selectedRole}
          sessionId={sessionId}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
