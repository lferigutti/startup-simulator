import { useState } from "react";
import RoleSelection from "@/components/sections/role-selection/RoleSelection.tsx";
import ScenarioView from "@/components/sections/scenario-view/ScenarioView.tsx";
import type {
  DecideResponse,
  Phase,
  RoleId,
  Scenario,
  Session,
} from "@/models";
import { useMutation } from "@tanstack/react-query";
import { request } from "@/lib/request";

export interface Decision {
  scenarioId: number;
  choiceIndex: number;
}

export default function MainBoard() {
  const [phase, setPhase] = useState<Phase>("role-selection");
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  const [sessionDataState, setSessionDataState] = useState<Session | null>(
    null
  );

  const createSessionMutation = useMutation({
    mutationFn: (role: RoleId) => {
      return request<Session>(`sessions/create?role=${role}`, "POST");
    },
  });

  const postChoiceMutation = useMutation({
    mutationFn: (data: {
      sessionId: string;
      scenarioId: string;
      choiceId: string;
    }) => {
      return request<DecideResponse>(
        `sessions/${data.sessionId}/decide`,
        "POST",
        { scenario_id: data.scenarioId, choice_id: data.choiceId }
      );
    },
  });

  const handleRoleSelect = async (roleId: RoleId) => {
    const sessionData = await createSessionMutation.mutateAsync(roleId);
    if (sessionData && sessionData.sessionId) {
      setSessionDataState(sessionData);
      setCurrentScenario(sessionData.first_scenario);
    }
    setPhase("scenarios");
  };

  const handleNextScenario = (choiceId: string) => {
    if (!sessionDataState || !currentScenario) return;

    postChoiceMutation
      .mutateAsync({
        sessionId: sessionDataState.sessionId,
        scenarioId: currentScenario.id,
        choiceId,
      })
      .then((decideResponse) => {
        if (!decideResponse) return;
        if (decideResponse.next_scenario) {
          setCurrentScenario(decideResponse.next_scenario);
        } else {
          // All scenarios completed
          setPhase("profile");
        }
      });
  };

  // const handleScenarioComplete = (allDecisions: Decision[]) => {
  //   setDecisions(allDecisions);
  //   setPhase("profile");
  // };

  // const handleStartReflection = () => {
  //   setPhase("reflection");
  // };

  // const handleRestart = () => {
  //   setPhase("role-selection");
  //   setSelectedRole(null);
  //   setDecisions([]);
  //   setSessionId("");
  // };

  return (
    <main className="min-h-screen bg-background">
      {phase === "role-selection" && (
        <RoleSelection onRoleSelect={handleRoleSelect} />
      )}

      {phase === "scenarios" && sessionDataState && (
        <ScenarioView
          roleName={sessionDataState.role.name}
          scenario={currentScenario}
          handleNextScenario={handleNextScenario}
          currentScenario={0}
          totalScenarios={sessionDataState.total_scenarios}
        />
      )}

      {/* {phase === "profile" && selectedRole && (
        <ProfileView
          role={selectedRole}
          decisions={decisions}
          onStartReflection={handleStartReflection}
          onRestart={handleRestart}
        />
      )} */}

      {/* {phase === "reflection" && selectedRole && (
        <ReflectionChat
          role={selectedRole}
          sessionId={sessionId}
          onRestart={handleRestart}
        />
      )} */}
    </main>
  );
}
