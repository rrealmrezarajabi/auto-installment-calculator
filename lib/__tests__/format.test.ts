import { describe, expect, it } from "vitest";
import { parseWholeAmount } from "../format";

describe("parseWholeAmount", () => {
  it.each(["1234567", "۱٬۲۳۴٬۵۶۷", "١٬٢٣٤٬٥٦٧", "1,234,567", " ۱۲۳۴۵۶۷ "])("accepts %s", (value) => {
    expect(parseWholeAmount(value)).toBe(1_234_567);
  });
  it.each(["", " ", "-1", "1.5", "۱٫۵", "1e6", "abc", "1,23", "9007199254740992"])("rejects %s", (value) => {
    expect(parseWholeAmount(value)).toBeNaN();
  });
  it("preserves an explicitly entered zero", () => {
    expect(parseWholeAmount("۰")).toBe(0);
  });
});
