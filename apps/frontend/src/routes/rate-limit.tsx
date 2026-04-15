import Page from "@/shared/components/Page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/rate-limit")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Page>
      <Page.Body type="center">
        <div className="flex flex-col items-center justify-center gap-2">
          <h1 className="text-3xl font-bold">
            RATE LIMIT: FREE TIER FROM RENDER
          </h1>
          <div className="text-muted-foreground dark:text-dark-muted-foreground">
            <p>
              This is due to Render's free tier When this happens please click
            </p>
            <p>
              on this link:
              <a
                href="https://novelwebsite-backend.onrender.com"
                className="nav-link text-underline-off-set-1 text-blue-500"
              >
                {"https://novelwebsite-backend.onrender.com"}
              </a>
            </p>
            <p>
              Then wait till that website is ready. When it's ready go back here
            </p>
          </div>
        </div>
      </Page.Body>
    </Page>
  );
}
