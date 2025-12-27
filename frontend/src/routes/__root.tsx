import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ErrorPage from "@/components/sections/error-pages/ErrorPage";
import NotFoundPage from "@/components/sections/error-pages/NotFoundPage";


const RootLayout = () => (
  <>
    <Outlet />
    <TanStackRouterDevtools />
  </>
);




export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  component: RootLayout,
});
