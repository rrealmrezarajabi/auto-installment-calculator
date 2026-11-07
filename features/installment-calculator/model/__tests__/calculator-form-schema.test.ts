import { describe, expect, it } from "vitest";
import { createCalculatorFormSchema, type CalculatorFormValues } from "../calculator-form-schema";

const vehicles = [{ id: "sample", name: "خودروی نمونه", price: 1_000 }];
const options = { annualInterestRate: 24, allowedMonths: [12, 24], currency: "IRT" } as const;
const schema = createCalculatorFormSchema(vehicles, options);
const values: CalculatorFormValues = {
  mode: "catalog", vehicleId: "sample", customName: "", customPrice: "", downPayment: "۲۰۰", months: "12",
};

describe("calculator form schema", () => {
  it("takes the selected price and annual rate from API data", () => {
    expect(schema.parse(values)).toEqual({
      vehicleName: "خودروی نمونه",
      calculatorInput: { vehiclePrice: 1_000, downPayment: 200, annualInterestRate: 24, months: 12 },
    });
  });
  it("accepts manual entry without any catalog vehicles", () => {
    expect(createCalculatorFormSchema([], options).parse({
      ...values, mode: "manual", customName: "  خودروی من  ", customPrice: "۲٬۰۰۰",
    }).calculatorInput.vehiclePrice).toBe(2_000);
  });
  it.each([
    { vehicleId: "missing" }, { downPayment: "" }, { downPayment: "۱۰۰۱" },
    { months: "36" }, { mode: "manual", customName: "", customPrice: "1000" },
    { mode: "manual", customName: "خودرو", customPrice: "0" },
  ])("rejects invalid fields: %j", (overrides) => {
    expect(schema.safeParse({ ...values, ...overrides }).success).toBe(false);
  });
});
