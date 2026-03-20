import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorLogging } from "./middlewares/error-log.js";
import { errorResponse } from "./middlewares/error-response.js";
import authorRoutes from "./features/authors/author.routes.js";
import chapterRoutes from "./features/chapters/chapter.routes.js";
import novelRoutes from "./features/novels/novel.routes.js";
import oauthRoutes from "./features/auth/auth.routes.js";
import userRoutes from "./features/users/user.routes.js";
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
app.use("/users", userRoutes);
app.get("/", (req, res) => {
  res.send("Hello, Novel Translation Backend Website!").status(200);
});

app.use(errorResponse);

process.env.NODE_ENV !== "test" && app.use(errorLogging);
export { app };
