import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/session/$sessionId_/complete")({
  component: ProfileViewRouteComponent,
});

function ProfileViewRouteComponent() {
  return <div>Hola macho</div>;
}
