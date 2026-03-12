import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppProvider } from "../app/stores/AppContext";
import App from "../app/App";
import type { QueryClient } from "@tanstack/react-query";
import { NotFound } from "@/shared/components/NotFound";
import { queryAuthOption } from "@/features/auth/api/auth";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return <NotFound root={true} />;
  },
  beforeLoad: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(queryAuthOption());
  },
  errorComponent: ({ error }) => {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  },
});

function RootComponent() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
