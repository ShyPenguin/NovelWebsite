import { NovelLatestChaptersSchema } from "@/schemas/novel-latest-chapters/schema.js";
import { z } from "zod";

export type NovelLatestChapterDTO = z.infer<typeof NovelLatestChaptersSchema>;
