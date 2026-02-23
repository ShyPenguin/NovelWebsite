import { z } from "zod";
import { NovelLatestChaptersSchema } from "../schemas/novelLatestChapters/schema";

export type NovelLatestChapterDTO = z.infer<typeof NovelLatestChaptersSchema>;
