import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import "./styles/global.css";
import { queryClient, router } from "./routes";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  const AppTree = (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
  root.render(
    import.meta.env.MODE == "dev" ? (
      <StrictMode>{AppTree}</StrictMode>
    ) : (
      AppTree
    ),
  );
}
