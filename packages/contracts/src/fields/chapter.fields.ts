import { createEnumError } from "@/utils/createEnumError.js";
import { z } from "zod";
import { createStringNumberToNumber } from "./novel.fields.js";

export const chapterStatus = ["draft", "review", "published"] as const;
export const chapterAccessTypes = ["free", "paid"] as const;

export const chapterNumberField =
  createStringNumberToNumber("Chapter's number");

export const chapterStatusField = z.enum(chapterStatus, {
  message: createEnumError({ fieldName: "Status", array: chapterStatus }),
});

export const chapterAccessField = z.enum(chapterAccessTypes, {
  message: createEnumError({ fieldName: "Access", array: chapterAccessTypes }),
});
