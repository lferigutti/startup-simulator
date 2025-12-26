import { createFileRoute, useNavigate } from "@tanstack/react-router";
import RoleSelection from "@/components/sections/role-selection/RoleSelection.tsx";
import { request } from "@/lib/request";
import type { Role, RoleId, Session } from "@/models";
import { useMutation } from "@tanstack/react-query";

export const Route = createFileRoute("/")({
  loader: async () => {
    return {
      roles: await request<Role[]>("roles"),
    };
  },

  component: RoleSelectionRoute,
});

function RoleSelectionRoute() {
  const { roles } = Route.useLoaderData();
  const navigate = useNavigate();

  const createSessionMutation = useMutation({
    mutationFn: (role: RoleId) => {
      return request<Session>(`sessions/create?role=${role}`, "POST");
    },
    onSuccess: (data) => {
      if (data) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId: data.sessionId },
        })
      } else {
        console.error("No session data returned");
        throw new Error("Failed to create session");
      }
    },
  });

  return (
    <RoleSelection
      roles={roles}
      onRoleSelect={(roleId) => createSessionMutation.mutate(roleId)}
    />
  );
}
