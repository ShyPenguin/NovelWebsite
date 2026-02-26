import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
// import { errorLogging } from "./middlewares/errorLog.ts";
import { errorResponse } from "./middlewares/error-response.ts";
import authorRoutes from "./features/authors/author.routes.ts";
import chapterRoutes from "./features/chapters/chapter.routes.ts";
import novelRoutes from "./features/novels/novel.routes.ts";
import oauthRoutes from "./features/auth/auth.routes.ts";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/oauth", oauthRoutes);
app.use("/novels", novelRoutes);
app.use("/authors", authorRoutes);
app.use("/chapters", chapterRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Novel Translation Backend Website!").status(200);
});

app.use(errorResponse);
// app.use(errorLogging);
export { app };
