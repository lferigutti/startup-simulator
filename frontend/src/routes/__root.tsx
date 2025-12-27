import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ErrorPage from "@/components/sections/error-pages/ErrorPage";
import NotFoundPage from "@/components/sections/error-pages/NotFoundPage";

const RootLayout = () => (
  <div className="min-h-screen flex flex-col bg-background text-foreground">
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <span className="text-sm font-medium tracking-tight text-foreground/80">
          Leonardo Ferigutti
        </span>
        <span className="text-xs text-muted-foreground">
          Exploring how people decide in startup environments
        </span>
      </div>
    </header>
    <main className="flex-1">
      <Outlet />
    </main>
    <TanStackRouterDevtools />
  </div>
);

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  component: RootLayout,
});
