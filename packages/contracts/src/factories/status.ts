import { z } from "zod";

export const StatusMap = <T extends Record<number, z.ZodType>>(map: T) => map;
