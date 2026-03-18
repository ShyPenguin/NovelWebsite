import { execSync } from "node:child_process";

execSync("tsx scripts/check-db.js", { stdio: "inherit" });
execSync("npm run dev:db:migrate", { stdio: "inherit" });
execSync("npm run dev:db:seed", { stdio: "inherit" });
execSync("tsx watch src/server.js", { stdio: "inherit" });
