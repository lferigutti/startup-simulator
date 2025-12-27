import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { request } from "@/lib/request";
import type { ArchetypeMatch, Session } from "@/models";
import ProfileView from "@/components/sections/profile-view/ProfileView";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/session/$sessionId_/complete")({
  /** This loader fetches the session and profile data for the completed session
   * at /session/$sessionId/complete. If the profile does not exist, it triggers
   * profile generation and then fetches the profile again.
   */
  loader: async ({ params }) => {
    try {
      const session = await request<Session>(
        `sessions/${params.sessionId}`,
        "GET"
      );

      if (!session || !session.is_completed) {
        throw redirect({
          to: "/session/$sessionId",
          params: { sessionId: params.sessionId },
        });
      }

      const profile = await request<ArchetypeMatch>(
        `sessions/${params.sessionId}/profile`,
        "GET"
      );
      return { profile };
    } catch (error) {
      if (error && typeof error === "object" && "href" in error) {
        throw error;
      }

      if (
        error &&
        typeof error === "object" &&
        "status" in error &&
        error.status === 404
      ) {
        await request<string>(
          `sessions/${params.sessionId}/generate_profile`,
          "POST"
        );
        const profile = await request<ArchetypeMatch>(
          `sessions/${params.sessionId}/profile`,
          "GET"
        );
        return { profile };
      }

      throw error;
    }
  },
  component: ProfileViewRouteComponent,
  errorComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-destructive">
          There was an error loading your profile.
        </p>
        <p className="text-muted-foreground mt-2">
          Please try refreshing the page.
        </p>
      </div>
    </div>
  ),
  pendingComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg text-muted-foreground">Loading your profile...</p>
      </div>
    </div>
  ),
});

function ProfileViewRouteComponent() {
  const { profile } = Route.useLoaderData();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive">
            Profile data is missing.
          </p>
          <p className="text-muted-foreground mt-2">
            Please try restarting the session.
          </p>
        </div>
      </div>
    );
  }



  const handleRestart = () => {
    navigate({ to: "/" });
  };

  return (
    <ProfileView
      profile={profile}
      onRestart={handleRestart}
    />
  );
}
