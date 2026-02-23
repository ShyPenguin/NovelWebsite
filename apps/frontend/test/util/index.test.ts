import { expect, describe, it } from "vitest";
import { parseKeysToLabel } from "../../src/utils/parseKeysToLabel";
import {
  novelSortWithDirection,
  novelStatusQuery,
} from "@repo/contracts/fields/novel";
describe("parsekeysToLabel", () => {
  it("createdAt to Created at", () => {
    const data = "createdAt";
    const result = parseKeysToLabel(data);

    expect(result).toBe("Created at");
  });

  it("Filter novelSort to desc only and \
    automatically have the labels parsed from the keys", () => {
    const filtered = novelSortWithDirection
      .filter((item) => item.includes("desc"))
      .map((item) => {
        return {
          value: item,
          label: parseKeysToLabel(item),
        };
      });
    expect(filtered).toMatchObject([
      {
        value: "desc(createdAt)",
        label: "Created at",
      },
      { value: "desc(updatedAt)", label: "Updated at" },
      { value: "desc(title)", label: "Title" },
    ]);
  });
  it("Parse novelStatus into labels", () => {
    const parsed = novelStatusQuery.map((item) => {
      return {
        value: item,
        label: parseKeysToLabel(item),
      };
    });
    expect(parsed).toMatchObject([
      { value: "ALL", label: "All" },
      { value: "ONGOING", label: "Ongoing" },
      { value: "COMPLETED", label: "Completed" },
      { value: "HIATUS", label: "Hiatus" },
      { value: "DROPPED", label: "Dropped" },
    ]);
  });
});
