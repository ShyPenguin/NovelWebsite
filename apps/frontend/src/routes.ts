// router.ts
import { createRouter } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { ApiError } from "./shared/utils/apiError";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 429) {
          return false; // don't retry rate limit
        }
        return failureCount < 3;
      },
    },
  },
});

queryClient.getQueryCache().subscribe((event) => {
  if (event.query.state.error) {
    const error = event.query.state.error;

    if (error instanceof ApiError && error.status === 429) {
      router.navigate({ to: "/rate-limit" });
    }
  }
});
// Import the generated route tree
export const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
