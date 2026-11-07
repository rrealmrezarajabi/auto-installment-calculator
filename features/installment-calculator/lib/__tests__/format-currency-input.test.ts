import { describe, expect, it } from "vitest";
import { formatCurrencyInput } from "../format-currency-input";

describe("live currency input formatting", () => {
  it.each(["1234567", "۱۲۳۴۵۶۷", "١٢٣٤٥٦٧", "1,234,567"])("formats %s with Persian digits and grouping", (value) => {
    expect(formatCurrencyInput(value, value.length)).toEqual({ value: "۱٬۲۳۴٬۵۶۷", caret: 9 });
  });
  it("preserves an empty field", () => {
    expect(formatCurrencyInput("", 0)).toEqual({ value: "", caret: 0 });
  });
  it("keeps the caret beside the edited digit in the middle", () => {
    expect(formatCurrencyInput("۱۲9٬۳۴۵", 3)).toEqual({ value: "۱۲۹٬۳۴۵", caret: 3 });
  });
  it("removes redundant leading zeros without losing the caret", () => {
    expect(formatCurrencyInput("001234", 6)).toEqual({ value: "۱٬۲۳۴", caret: 5 });
  });
  it("keeps unsafe integers exact for validation", () => {
    expect(formatCurrencyInput("9007199254740993", 16).value).toBe("۹٬۰۰۷٬۱۹۹٬۲۵۴٬۷۴۰٬۹۹۳");
  });
  it.each(["1.5", "۱٫۵", "-100", "1e6"])("does not silently reinterpret invalid amount %s", (value) => {
    expect(formatCurrencyInput(value, value.length).value.replace(/[۰-۹]/g, "#"))
      .toBe(value.replace(/[0-9۰-۹]/g, "#"));
  });
});
