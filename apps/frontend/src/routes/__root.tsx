import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppProvider } from "../stores/AppContext";
import App from "../App";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
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
