import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import ScenarioView from "@/components/sections/scenario-view/ScenarioView";
import { request } from "@/lib/request";
import type { Session } from "@/models";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/session/$sessionId")({
  loader: async ({ params }) => {
    console.log("Loading session:", params.sessionId);
    const sessionData = await request<Session>(`sessions/${params.sessionId}`);

    if (!sessionData) {
      throw new Error("Session data not found");
    }

    if (sessionData.is_completed) {
      throw redirect({
        to: "/session/$sessionId/complete",
        params: { sessionId: params.sessionId },
      });
    }
    return {
      sessionData,
    };
  },
  component: ScenarioRouteComponent,
  errorComponent: () => <div>There was an error loading the session.</div>,
  pendingComponent: () => <div>Loading session...</div>,
});

function ScenarioRouteComponent() {
  const { sessionData } = Route.useLoaderData();
  const router = useRouter();
  const navigate = useNavigate();

  const postChoice = useMutation({
    mutationFn: ({
      scenarioId,
      choiceId,
    }: {
      scenarioId: string;
      choiceId: string;
    }) => {
      return request<{ is_completed: boolean }>(
        `sessions/${sessionData.sessionId}/decide`,
        "POST",
        {
          scenario_id: scenarioId,
          choice_id: choiceId,
        }
      );
    },
    onSuccess: (response) => {
      if (!response) {
        alert("No response from server.");
        return;
      }
      if (response.is_completed) {
        navigate({
          to: "/session/$sessionId/complete",
          params: { sessionId: sessionData.sessionId },
        });
      } else {
        router.invalidate();
      }
    },
  });



  const handleNextScenario = (choiceId: string) => {
    if (!sessionData.current_scenario) {
      alert("No current scenario available.");
      return;
    }
    postChoice.mutate({
      scenarioId: sessionData.current_scenario.id,
      choiceId,
    });
  };
  

  return (
    <ScenarioView
      role={sessionData.role}
      scenario={sessionData.current_scenario}
      handleNextScenario={handleNextScenario}
      scenariosCompleted={sessionData.scenarios_completed}
      totalScenarios={sessionData.total_scenarios}
    />
  );
}
