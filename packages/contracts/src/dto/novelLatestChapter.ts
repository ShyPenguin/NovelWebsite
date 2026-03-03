import { z } from "zod";
import { NovelLatestChaptersSchema } from "../schemas/novel-latest-chapters/schema";

export type NovelLatestChapterDTO = z.infer<typeof NovelLatestChaptersSchema>;
