// @vitest-environment jsdom
import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { CalculationResult, InstallmentCalculation } from "../../model/calculator-types";
import { AmortizationTable } from "../amortization-table";

// Hand-calculated loan: 1,000 tomans, 10% monthly interest, two installments.
const calculation: InstallmentCalculation = {
  loanAmount: 1_000, monthlyPayment: 576, finalPayment: 576,
  totalInstallments: 1_152, totalPayment: 1_652, totalInterest: 152,
  schedule: [
    { month: 1, payment: 576, principal: 476, interest: 100, remainingBalance: 524 },
    { month: 2, payment: 576, principal: 524, interest: 52, remainingBalance: 0 },
  ],
};

afterEach(cleanup);

describe("amortization table", () => {
  it("shows the monthly breakdown and totals excluding the down payment", () => {
    render(<AmortizationTable result={{ success: true, data: calculation }} />);
    const table = screen.getByRole("table");
    expect(within(table).getAllByRole("columnheader").map((cell) => cell.textContent))
      .toEqual(["ماه", "مبلغ قسط", "اصل وام", "سود", "مانده وام"]);
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(4);
    expect(within(rows[1]).getAllByRole("cell").map((cell) => cell.textContent))
      .toEqual(["۵۷۶", "۴۷۶", "۱۰۰", "۵۲۴"]);
    expect(within(rows[2]).getAllByRole("cell").map((cell) => cell.textContent))
      .toEqual(["۵۷۶", "۵۲۴", "۵۲", "۰"]);
    expect(within(rows[3]).getAllByRole("cell").map((cell) => cell.textContent))
      .toEqual(["۱٬۱۵۲", "۱٬۰۰۰", "۱۵۲", "۰"]);
    expect(within(rows[2]).getByRole("rowheader").textContent).toContain("آخر");
    expect(within(table).queryByText("۱٬۶۵۲")).toBeNull();
    expect(screen.getByRole("region", { name: "ناحیه پیمایش جدول اقساط" }).tabIndex).toBe(0);
  });

  it("explains a different final payment caused by rounding", () => {
    render(<AmortizationTable result={{ success: true, data: {
      loanAmount: 1_000, monthlyPayment: 333, finalPayment: 334,
      totalInstallments: 1_000, totalPayment: 1_000, totalInterest: 0,
      schedule: [
        { month: 1, payment: 333, principal: 333, interest: 0, remainingBalance: 667 },
        { month: 2, payment: 333, principal: 333, interest: 0, remainingBalance: 334 },
        { month: 3, payment: 334, principal: 334, interest: 0, remainingBalance: 0 },
      ],
    } }} />);
    expect(screen.getByText("مبلغ قسط آخر برای تسویه دقیق مانده وام، ۳۳۴ تومان تنظیم شده است.")).toBeTruthy();
  });

  it("shows a settled purchase without an empty table", () => {
    render(<AmortizationTable result={{ success: true, data: {
      loanAmount: 0, monthlyPayment: 0, finalPayment: 0,
      totalInstallments: 0, totalPayment: 1_500, totalInterest: 0, schedule: [],
    } }} />);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("قیمت خودرو کامل پرداخت شده است؛ قسطی برای نمایش وجود ندارد.")).toBeTruthy();
  });

  it.each<CalculationResult | null>([
    null,
    { success: false, error: { code: "UNSAFE_AMOUNT", message: "مبلغ نامعتبر" } },
  ])("removes the previous table when the result becomes invalid: %j", (invalidResult) => {
    const { rerender } = render(<AmortizationTable result={{ success: true, data: calculation }} />);
    expect(screen.getByRole("table")).toBeTruthy();
    rerender(<AmortizationTable result={invalidResult} />);
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("پس از تکمیل و اصلاح اطلاعات فرم، ریز اقساط اینجا نمایش داده می‌شود.")).toBeTruthy();
  });
});
