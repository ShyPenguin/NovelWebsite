import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import oauthRoutes from "./routes/oauthRoutes.ts";
import novelRoutes from "./routes/novelRoutes.ts";
import authorRoutes from "./routes/authorRoutes.ts";
import categoryRoutes from "./routes/categoryRoutes.ts";
import chapterRoutes from "./routes/chapterRoutes.ts";
import reviewRoutes from "./routes/reviewRoutes.ts";
import commentRoutes from "./routes/commentRoutes.ts";
import imageRoutes from "./routes/imageRoutes.ts";
import { errorResponse } from "./middlewares/errorResponse.ts";
import { errorLogging } from "./middlewares/errorLog.ts";
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
app.use("/categories", categoryRoutes);
app.use("/chapters", chapterRoutes);
app.use("/reviews", reviewRoutes);
app.use("/comments", commentRoutes);
app.use("/images", imageRoutes);

app.get("/", (req, res) => {
  res.send("Hello, Novel Translation Backend Website!").status(200);
});

app.use(errorResponse);
// app.use(errorLogging);
export { app };
