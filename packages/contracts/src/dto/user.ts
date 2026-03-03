import { z } from "zod";
import { UserDetailSchema, UserThumbnailSchema } from "../schemas/user/schema";

export type UserDetailDTO = z.infer<typeof UserDetailSchema>;
export type UserThumbnailDTO = z.infer<typeof UserThumbnailSchema>;
