import { app } from "./app.ts";
const PORT = 3000;

app.listen(PORT, async () => {
  console.log(`Web Server running on port ${PORT}`);
  console.log(`Database Server running on port ${process.env.DB_PORT}`);
});
