import { describe, expect, it } from "vitest";
import { parseWholeAmount } from "../format";

describe("currency parsing", () => {
  it("reads grouped Persian amounts and explicit zero", () => {
    expect(parseWholeAmount("۱٬۲۳۴٬۵۶۷")).toBe(1_234_567);
    expect(parseWholeAmount("۰")).toBe(0);
  });

  it("rejects missing amounts and decimals instead of changing their meaning", () => {
    expect(parseWholeAmount("")).toBeNaN();
    expect(parseWholeAmount("۱٫۵")).toBeNaN();
  });
});
