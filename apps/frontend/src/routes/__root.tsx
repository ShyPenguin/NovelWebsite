import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppProvider } from "../stores/AppContext";
import App from "../App";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
