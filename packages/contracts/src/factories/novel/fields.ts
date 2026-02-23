import { z } from "zod";

export const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;
export const novelTypes = ["original", "translated"] as const;
export const language = ["english", "korean", "chinese", "japanese"] as const;

export const novelTypeField = z.enum(novelTypes, {
  message: "Type must be either original or translated",
});

export const languageField = z.enum(language, {
  message:
    "Language is not supported. Language should be english, korean, chinese, or japanese",
});

export const weekDayField = z.enum(week, {
  message: "day must be: SUN, MON, TUE, WED, THU, FRI, or SAT",
});

// Unidirection
export const createStringNumberToNumber = (fieldName: string) =>
  z.codec(
    z.union([z.string(), z.number()], {
      error: (iss) =>
        iss.input === undefined || iss.input === null || iss.input === ""
          ? `${fieldName} is required`
          : `${fieldName} must be a number`,
    }),
    z.union([z.string(), z.number()], {
      error: (iss) =>
        iss.input === undefined || iss.input === null || iss.input === ""
          ? `${fieldName} is required`
          : `${fieldName} must be a number`,
    }),

    {
      decode: (numberString) => Number(numberString),
      encode: (numberString) => Number(numberString),
    },
  );

export const bookmarksField = createStringNumberToNumber("Bookmarks");

// WRITE NOVEL STATUS
export const novelStatus = [
  "ONGOING",
  "COMPLETED",
  "HIATUS",
  "DROPPED",
] as const;

export const novelStatusField = z.enum(novelStatus, {
  message: "Status must be either ONGOING, DROPPED, HIATUS, or COMPLETED",
});

// READ NOVEL STATUS (QUERY)
export const novelStatusQuery = [
  "ALL", // Add your new element
  ...novelStatus,
] as const;

export const novelStatusQueryField = z.enum(novelStatusQuery, {
  message: "Status must be either ALL, ONGOING, DROPPED, HIATUS, or COMPLETED",
});
