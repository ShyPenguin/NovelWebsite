import { expect, describe, it } from "vitest";

import { z } from "zod";
import { randomUUID } from "crypto";
import {
  createIsoStringToDateField,
  isoStringToDate,
  yyyyMmDdStringToDate,
} from "../../src/schemas/date/schema";
import { getFormattedDate } from "../../src/utils/export/getFormattedDate";
import {
  titleField,
  descriptionField,
  idField,
  createIdField,
  dateField,
  createDateField,
  createUrlField,
} from "../../src/fields/fields";

describe("Fields", () => {
  describe("titleField", () => {
    it("fails when title is more than 255 letters", () => {
      const data = "a".repeat(256);
      const { success, error } = titleField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("255 Letters maximum for title");
    });

    it("fails when title is only whitespace", () => {
      const data = "     ";
      const { success, error } = titleField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("1 Letter minimum for title");
    });

    it("fails when title is not a string", () => {
      const data = 123;
      const { success, error } = titleField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Title must be a string");
    });

    it("fails when title is undefined", () => {
      const { success, error } = titleField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Title is required");
    });

    it("title success", () => {
      const { success } = titleField.safeParse("Omniscient");

      expect(success).toBe(true);
    });
  });

  describe("descriptionField", () => {
    it("fails when description is more than 1000 letters", () => {
      const data = "a".repeat(1001);
      const { success, error } = descriptionField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "1000 Letters maximum for description",
      );
    });

    it("fails when description is only whitespace", () => {
      const data = "     ";
      const { success, error } = descriptionField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("1 Letter minimum for description");
    });

    it("fails when description is not a string", () => {
      const data = 123;
      const { success, error } = descriptionField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Description must be a string");
    });

    it("fails when description is undefined", () => {
      const { success, error } = descriptionField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Description is required");
    });

    it("description success", () => {
      const { success } = descriptionField.safeParse("Omniscient");

      expect(success).toBe(true);
    });
  });

  describe("idField", () => {
    it("fails when id is undefined", () => {
      const { success, error } = idField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("ID is required");
    });

    it("fails when id is not in correct format", () => {
      const data = 123;
      const { success, error } = idField.safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("ID is not in correct format");
    });

    it("id success", () => {
      const { success } = idField.safeParse(randomUUID());

      expect(success).toBe(true);
    });
  });

  describe("createIdField('Novel')", () => {
    it("fails when id is undefined", () => {
      const { success, error } = createIdField("Novel").safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Novel's ID is required");
    });

    it("fails when id is not in correct format", () => {
      const data = 123;
      const { success, error } = createIdField("Novel").safeParse(data);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Novel's ID is not in correct format",
      );
    });

    it("id success", () => {
      const { success } = createIdField("Novel").safeParse(randomUUID());

      expect(success).toBe(true);
    });
  });

  describe("dateField", () => {
    it("returns fail when dataField is undefined", () => {
      const { success, error } = dateField.safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Date is required");
    });

    it("returns fail when dataField is not in correct format", () => {
      const { success, error } = dateField.safeParse(3232132);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Date must be a string");
    });

    it("returns fail when dataField is not in correct format", () => {
      const { success, error } = dateField.safeParse("31-07-2002");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Date must be in YYYY-MM-DD format");
    });

    it("success", () => {
      const { success } = dateField.safeParse("2002-07-31");

      expect(success).toBe(true);
    });
  });

  describe("createDateField", () => {
    it("returns fail when createDataField('Release') is undefined", () => {
      const { success, error } =
        createDateField("Release").safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("Release is required");
    });

    it("returns fail when createDataField('Release') is not string", () => {
      const { success, error } = createDateField("Release").safeParse(3232132);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Release must be in YYYY-MM-DD string format",
      );
    });

    it("returns fail when createDataField('Release') is not in correct format", () => {
      const { success, error } =
        createDateField("Release").safeParse("31-07-2002");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe(
        "Release must be in YYYY-MM-DD string format",
      );
    });

    it("success", () => {
      const { success } = createDateField("Release").safeParse("2002-07-31");

      expect(success).toBe(true);
    });
  });

  describe("yyyyMmDdStringToDate", () => {
    it("returns fail when yyyyMmDdStringToDate is undefined", () => {
      const { success, error } = yyyyMmDdStringToDate.safeParse(undefined);

      expect(success).toBe(false);
    });

    it("returns fail when yyyyMmDdStringToDate is not in correct format", () => {
      const { success, error } = yyyyMmDdStringToDate.safeParse(new Date());

      expect(success).toBe(false);
    });

    it("success decode from YYYY-MM-DD", () => {
      const { success, data } = yyyyMmDdStringToDate.safeParse("2002-07-31");

      expect(success).toBe(true);
      expect(data).toStrictEqual(new Date("2002-07-31"));
    });

    it("encode returns fail when undefined", () => {
      //@ts-expect-error
      const { success, error } = yyyyMmDdStringToDate.safeEncode(undefined);

      expect(success).toBe(false);
    });

    it("encode returns fail when string date", () => {
      //@ts-expect-error
      const { success, error } = yyyyMmDdStringToDate.safeEncode("2002-07-31");

      expect(success).toBe(false);
    });

    it("success encode from DATE to YYYY-MM-DD", () => {
      const { success, data } = yyyyMmDdStringToDate.safeEncode(new Date());

      expect(success).toBe(true);
      expect(data).toBe(getFormattedDate(new Date()));
    });
  });

  describe("isoStringToDate", () => {
    describe("the field", () => {
      it("returns fail when isoStringToDate is undefined", () => {
        const { success, error } = isoStringToDate.safeParse(undefined);

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.formErrors[0]).toBe("Date is required");
      });

      it("returns fail when isoStringToDate is not in correct format", () => {
        const { success, error } = isoStringToDate.safeParse(new Date());

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.formErrors[0]).toBe("Date is not in ISO date string");
      });

      it("success decode from isoString to Date", () => {
        const { success, data } = isoStringToDate.safeParse(
          new Date("2002-07-31").toISOString(),
        );

        expect(success).toBe(true);
        expect(data).toEqual(new Date("2002-07-31"));
      });

      it("encode returns fail when undefined", () => {
        //@ts-expect-error
        const { success, error } = isoStringToDate.safeEncode(undefined);

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.formErrors[0]).toBe("Date is required");
      });

      it("encode returns fail when iso string", () => {
        const { success, error } = isoStringToDate.safeEncode(
          //@ts-expect-error
          new Date("2002-07-31").toISOString(),
        );

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);

        expect(flattened.formErrors[0]).toBe("Date is not in Date type");
      });

      it("success encode from DATE to Isostring", () => {
        const input = new Date();
        const { success, data } = isoStringToDate.safeEncode(input);

        expect(success).toBe(true);
        expect(data).toBe(input.toISOString());
      });
    });
    describe("createIsoStringToDateField(`publishedAt`)", () => {
      it("returns fail when createIsoStringToDateField(`publishedAt`) is undefined", () => {
        const { success, error } =
          createIsoStringToDateField(`publishedAt`).safeParse(undefined);

        expect(success).toBe(false);
        const flattened = z.flattenError(error!);
        expect(flattened.formErrors[0]).toBe("publishedAt is required");
      });
    });
  });

  describe("createUrlField", () => {
    it("returns fail when createDataField('docUrl') is undefined", () => {
      const { success, error } = createUrlField("docUrl").safeParse(undefined);

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("docUrl is required");
    });

    it("returns fail when createDataField('docUrl') is not in correct format", () => {
      const { success, error } =
        createUrlField("docUrl").safeParse("321312/gdfjgfk");

      expect(success).toBe(false);
      const flattened = z.flattenError(error!);
      expect(flattened.formErrors[0]).toBe("docUrl is invalid URL");
    });

    it("success", () => {
      const { success } = createUrlField("docUrl").safeParse(
        "https://docs.google.com/document/d/1hPxEP32WViJX0e5dQtmSKRS02996ghkQugCXG4s8u1s/edit?tab=t.0",
      );

      expect(success).toBe(true);
    });
  });
});
