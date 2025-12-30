import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import ErrorPage from "@/components/sections/error-pages/ErrorPage";
import NotFoundPage from "@/components/sections/error-pages/NotFoundPage";
import MainHeader from "@/components/layout/MainHeader";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";

const RootLayout = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <MainHeader isDark={isDark} setIsDark={setIsDark} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <TanStackRouterDevtools />
    </div>
  );
};

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  errorComponent: ErrorPage,
  component: RootLayout,
});
