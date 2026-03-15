import { execSync } from "node:child_process";

execSync("tsx scripts/check-db.ts", { stdio: "inherit" });
execSync("npm run db:migrate", { stdio: "inherit" });
execSync("npm run dev:seed", { stdio: "inherit" });
execSync("tsx watch src/server.ts", { stdio: "inherit" });
