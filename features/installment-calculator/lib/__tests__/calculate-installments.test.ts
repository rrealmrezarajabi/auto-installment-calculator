import { describe, expect, it } from "vitest";

import type { CalculatorInput, InstallmentCalculation } from "../../model/calculator-types";
import { calculateInstallments } from "../calculate-installments";

const defaultInput: CalculatorInput = {
  vehiclePrice: 1_000,
  downPayment: 0,
  annualInterestRate: 0,
  months: 3,
};

function calculate(input: CalculatorInput): InstallmentCalculation {
  const result = calculateInstallments(input);
  if (!result.success) {
    throw new Error(result.error.message);
  }
  return result.data;
}

describe("calculateInstallments", () => {
  it("matches a manually calculated two-month interest-bearing loan", () => {
    // P=1,000; r=0.1; n=2. PMT=1,000*0.1/(1-1.1^-2)=576.190476...
    // Month 1: interest=100, principal=476, balance=524.
    // Month 2: interest=round(52.4)=52, principal=524, payment=576.
    const result = calculate({ ...defaultInput, annualInterestRate: 120, months: 2 });

    expect(result).toEqual({
      loanAmount: 1_000,
      monthlyPayment: 576,
      finalPayment: 576,
      totalInstallments: 1_152,
      totalInterest: 152,
      totalPayment: 1_152,
      schedule: [
        { month: 1, payment: 576, principal: 476, interest: 100, remainingBalance: 524 },
        { month: 2, payment: 576, principal: 524, interest: 52, remainingBalance: 0 },
      ],
    });
  });

  it("reconciles a zero-interest rounding shortfall in the final installment", () => {
    const result = calculate(defaultInput);

    expect(result.monthlyPayment).toBe(333);
    expect(result.schedule.map(({ payment }) => payment)).toEqual([333, 333, 334]);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayment).toBe(1_000);
  });

  it("reduces the final installment when regular payments round up", () => {
    const result = calculate({ ...defaultInput, vehiclePrice: 1_001 });
    expect(result.schedule.map(({ payment }) => payment)).toEqual([334, 334, 333]);
  });

  it("includes the down payment exactly once and charges interest only on the loan", () => {
    const result = calculate({
      vehiclePrice: 1_500, downPayment: 500, annualInterestRate: 120, months: 2,
    });
    expect(result.loanAmount).toBe(1_000);
    expect(result.totalInstallments).toBe(1_152);
    expect(result.totalInterest).toBe(152);
    expect(result.totalPayment).toBe(1_652);
  });

  it("returns no installments when the entire price is paid up front", () => {
    const result = calculate({ ...defaultInput, downPayment: 1_000, annualInterestRate: 24 });
    expect(result).toEqual({
      loanAmount: 0, monthlyPayment: 0, finalPayment: 0,
      totalInstallments: 0, totalPayment: 1_000, totalInterest: 0, schedule: [],
    });
  });

  it("handles a single-month loan", () => {
    const result = calculate({ ...defaultInput, annualInterestRate: 12, months: 1 });
    expect(result.schedule).toEqual([
      { month: 1, payment: 1_010, principal: 1_000, interest: 10, remainingBalance: 0 },
    ]);
  });

  it("remains stable for a rate approaching zero", () => {
    const result = calculate({ ...defaultInput, annualInterestRate: 1e-12 });
    expect(result.monthlyPayment).toBe(333);
    expect(result.totalInterest).toBe(0);
    expect(result.totalPayment).toBe(1_000);
  });

  it("caps payments when rounding settles a small balance early", () => {
    const result = calculate({ ...defaultInput, vehiclePrice: 2, months: 4 });
    expect(result.schedule.map(({ payment }) => payment)).toEqual([1, 1, 0, 0]);
    expect(result.totalPayment).toBe(2);
  });

  const scenarios: CalculatorInput[] = [
    { vehiclePrice: 950_000_000, downPayment: 200_000_000, annualInterestRate: 24, months: 12 },
    { vehiclePrice: 1_100_000_000, downPayment: 350_000_000, annualInterestRate: 24, months: 48 },
    { vehiclePrice: 850_000_001, downPayment: 123_456_789, annualInterestRate: 18.5, months: 36 },
    { vehiclePrice: 10_001, downPayment: 0, annualInterestRate: 0, months: 24 },
    { vehiclePrice: 1, downPayment: 0, annualInterestRate: 24, months: 48 },
    { vehiclePrice: 2, downPayment: 0, annualInterestRate: 0, months: 4 },
    { vehiclePrice: 100_000_000, downPayment: 0, annualInterestRate: 12, months: 600 },
  ];

  it.each(scenarios)("keeps every row and summary consistent: %j", (input) => {
    const result = calculate(input);
    let balance = result.loanAmount;
    let principalSum = 0;
    let interestSum = 0;
    let paymentSum = 0;

    expect(result.schedule).toHaveLength(input.months);
    result.schedule.forEach((row, index) => {
      expect(row.month).toBe(index + 1);
      for (const amount of [row.payment, row.principal, row.interest, row.remainingBalance]) {
        expect(Number.isSafeInteger(amount)).toBe(true);
        expect(amount).toBeGreaterThanOrEqual(0);
      }
      expect(row.interest).toBe(Math.round(balance * (input.annualInterestRate / 100 / 12)));
      expect(row.payment).toBe(row.principal + row.interest);
      expect(row.remainingBalance).toBe(balance - row.principal);
      balance = row.remainingBalance;
      principalSum += row.principal;
      interestSum += row.interest;
      paymentSum += row.payment;
    });

    expect(balance).toBe(0);
    expect(principalSum).toBe(result.loanAmount);
    expect(interestSum).toBe(result.totalInterest);
    expect(paymentSum).toBe(result.totalInstallments);
    expect(paymentSum).toBe(result.loanAmount + result.totalInterest);
    expect(result.totalPayment).toBe(input.downPayment + paymentSum);
    expect(result.totalPayment).toBe(input.vehiclePrice + result.totalInterest);
    expect(result.finalPayment).toBe(result.schedule.at(-1)?.payment);
  });

  it.each([
    { vehiclePrice: 0 }, { vehiclePrice: -1 }, { vehiclePrice: 1.5 },
    { vehiclePrice: Number.MAX_SAFE_INTEGER + 1 },
    { downPayment: -1 }, { downPayment: 1_001 }, { downPayment: 0.5 },
    { annualInterestRate: -1 }, { annualInterestRate: NaN }, { annualInterestRate: Infinity },
    { months: 0 }, { months: -1 }, { months: 1.5 }, { months: 601 }, { months: Infinity },
  ])("returns a failure instead of throwing for invalid input: %j", (overrides) => {
    expect(calculateInstallments({ ...defaultInput, ...overrides })).toMatchObject({
      success: false, error: { code: "INVALID_INPUT" },
    });
  });

  it.each([1200, 12, Number.MAX_VALUE])("rejects unsafe computed amounts at annual rate %s", (annualInterestRate) => {
    expect(calculateInstallments({
      ...defaultInput, vehiclePrice: Number.MAX_SAFE_INTEGER, annualInterestRate, months: 12,
    })).toMatchObject({ success: false, error: { code: "UNSAFE_AMOUNT" } });
  });
});
