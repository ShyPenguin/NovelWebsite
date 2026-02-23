import { z } from "zod";
import { createStringNumberToNumber } from "../novel/fields";

export const chapterStatus = ["draft", "review", "published"] as const;
export const chapterAccessTypes = ["free", "paid"] as const;

export const chapterNumberField =
  createStringNumberToNumber("Chapter's number");

export const chapterStatusField = z.enum(chapterStatus, {
  message: "Status must be draft, review or published",
});

export const chapterAccessField = z.enum(chapterAccessTypes, {
  message: "Access must be free or paid",
});
