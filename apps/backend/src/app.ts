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
import chapterNestedRoutes from "./features/chapters/chapter.nested.route.js";
import bookmarkNestedRoute from "./features/bookmarks/bookmark.nested.routes.js";
import bookmarkRoutes from "./features/bookmarks/bookmark.routes.js";
import announcementRoutes from "./features/announcements/announcement.routes.js";
dotenv.config();

const app = express();
const env = process.env.NODE_ENV;

if (env !== "stage" && env !== "prod") {
  app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
    }),
  );
} else {
  app.set("trust proxy", true);
}

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/oauth", oauthRoutes);
app.use("/novels", novelRoutes);
app.use("/novels", chapterNestedRoutes);
app.use("/novels", bookmarkNestedRoute);
app.use("/chapters", chapterRoutes);
app.use("/authors", authorRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/users", userRoutes);
app.use("/announcements", announcementRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Novel Translation Backend Website!").status(200);
});

process.env.NODE_ENV !== "test" && app.use(errorLogging);

app.use(errorResponse);

export { app };
