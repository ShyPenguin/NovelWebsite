import { z } from "zod";
import { getFormattedDate } from "../../utils/export/getFormattedDate";
import { dateField, createDateField } from "../../fields/general";

//After To: Output (use decode to get output)
//Before To: Input (use encode to get input)

// Encode to get the ISO String
// Decode to get Date
export const isoStringToDate = z.codec(
  z.iso.datetime({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Date is required"
        : "Date is not in ISO date string",
  }), // input schema: ISO date string
  z.date({
    error: (iss) =>
      iss.input === undefined || iss.input === null || iss.input === ""
        ? "Date is required"
        : "Date is not in Date type",
  }), // output schema: Date object
  {
    decode: (isoString) => new Date(isoString), // ISO string → Date
    encode: (date) => date.toISOString(), // Date → ISO string
  },
);

export const createIsoStringToDateField = (fieldName: string) =>
  z.codec(
    z.iso.datetime({
      error: (iss) =>
        iss.input === undefined || iss.input === null || iss.input === ""
          ? `${fieldName} is required`
          : `${fieldName} is not in ISO date string`,
    }),
    z.date({
      error: (iss) =>
        iss.input === undefined || iss.input === null || iss.input === ""
          ? `${fieldName} is required`
          : `${fieldName} is not in Date type`,
    }),
    {
      decode: (isoString) => new Date(isoString),
      encode: (date) => date.toISOString(),
    },
  );
// Encode to get the formatted date
// Decode to get Date

export const yyyyMmDdStringToDate = z.codec(dateField, z.date(), {
  decode: (stringDate) => new Date(stringDate), // formatted Date string → Date
  encode: (date) => getFormattedDate(date), // Date → formatted Date string
});

export const createYyyyMmDdStringToDate = (fieldName: string) =>
  z.codec(
    createDateField(fieldName),
    z.date({
      error: (iss) =>
        iss.input === undefined || iss.input === null || iss.input === ""
          ? `${fieldName} is required`
          : `${fieldName} is not in Date type`,
    }),
    {
      decode: (YyyyMmDdString) => new Date(YyyyMmDdString),
      encode: (date) => getFormattedDate(date),
    },
  );
