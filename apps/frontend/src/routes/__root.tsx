import { createRootRouteWithContext } from "@tanstack/react-router";
import { AppProvider } from "../app/stores/AppContext";
import App from "../app/App";
import type { QueryClient } from "@tanstack/react-query";
import { NotFound } from "@/shared/components/NotFound";
import { Error } from "@/shared/components/Error";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  notFoundComponent: () => {
    return <NotFound root={true} />;
  },
  errorComponent: ({ error }) => {
    return <Error error={error} />;
  },
});

function RootComponent() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
