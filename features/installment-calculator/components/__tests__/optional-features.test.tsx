// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { formatNumber } from "@/lib/format";
import { CalculatorForm } from "../calculator-form";
import { CalculatorFromUrl } from "../calculator-from-url";
import { PrincipalInterestChart } from "../principal-interest-chart";
import { calculateInstallments } from "../../lib/calculate-installments";

const location = vi.hoisted(() => ({ search: "" }));
vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams(location.search) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const vehicles = [{ id: "sample", name: "خودروی نمونه", price: 1_000_000 }];
const options = { annualInterestRate: 24, allowedMonths: [12, 24, 36, 48], currency: "IRT" } as const;

afterEach(() => {
  cleanup();
  location.search = "";
  vi.restoreAllMocks();
});

describe("optional calculator features", () => {
  it("charts principal and interest from installments and omits settled loans", () => {
    const calculation = {
      loanAmount: 1_000, monthlyPayment: 576, finalPayment: 576,
      totalInstallments: 1_152, totalPayment: 1_652, totalInterest: 152, schedule: [],
    };
    const { rerender } = render(<PrincipalInterestChart calculation={calculation} />);
    const chart = screen.getByRole("figure", { name: "سهم اصل و سود از مجموع اقساط" });
    expect(within(chart).getByText("۱٬۰۰۰ تومان")).toBeTruthy();
    expect(within(chart).getByText("۱۵۲ تومان")).toBeTruthy();
    expect(within(chart).queryByText("۱٬۶۵۲ تومان")).toBeNull();
    expect(within(chart).getByRole("img").getAttribute("aria-label")).toContain("درصد");
    rerender(<PrincipalInterestChart calculation={{ ...calculation, loanAmount: 0, totalInterest: 0, totalInstallments: 0 }} />);
    expect(screen.queryByRole("figure")).toBeNull();
  });

  it("compares the same loan at two durations and applies a scenario to the main table", async () => {
    const user = userEvent.setup();
    render(<CalculatorForm vehicles={vehicles} options={options} />);
    const first = screen.getByRole("article", { name: "سناریوی ۱" });
    const second = screen.getByRole("article", { name: "سناریوی ۲" });
    const expected = calculateInstallments({ vehiclePrice: 1_000_000, downPayment: 300_000, annualInterestRate: 24, months: 36 });
    if (!expected.success) throw new Error("Expected a valid calculation");
    expect(within(first).getByLabelText<HTMLSelectElement>("سناریوی ۱").value).toBe("24");
    expect(within(second).getByText(`${formatNumber(expected.data.totalInterest)} تومان`)).toBeTruthy();
    await user.click(within(second).getByRole("button", { name: "اعمال در محاسبه" }));
    expect(screen.getByLabelText<HTMLSelectElement>("مدت بازپرداخت").value).toBe("36");
    expect(screen.getByTestId("monthly-payment").textContent).toBe(formatNumber(expected.data.monthlyPayment));
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(38);
  });

  it("copies a snapshot that restores the same numbers after API prices and rates change", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    const firstRender = render(<CalculatorForm vehicles={vehicles} options={options} />);
    const originalPayment = screen.getByTestId("monthly-payment").textContent;
    await user.selectOptions(screen.getByRole("combobox", { name: "سناریوی ۱" }), "48");
    await user.click(screen.getByRole("button", { name: "کپی لینک محاسبه" }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    location.search = new URL(writeText.mock.calls[0][0]).search;
    firstRender.unmount();

    render(<CalculatorFromUrl vehicles={[{ ...vehicles[0], price: 2_000_000 }]}
      options={{ ...options, annualInterestRate: 0 }} />);
    expect(screen.getByLabelText<HTMLInputElement>("قیمت خودرو").value).toBe("۱٬۰۰۰٬۰۰۰");
    expect(screen.getByText("۲۴٪")).toBeTruthy();
    expect(screen.getByRole<HTMLSelectElement>("combobox", { name: "سناریوی ۱" }).value).toBe("48");
    expect(screen.getByTestId("monthly-payment").textContent).toBe(originalPayment);
  });

  it("offers a current link when clipboard access fails and hides it after input changes", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Clipboard denied"));
    render(<CalculatorForm vehicles={vehicles} options={options} />);
    await user.click(screen.getByRole("button", { name: "کپی لینک محاسبه" }));
    const link = await screen.findByLabelText<HTMLInputElement>("لینک محاسبه");
    expect(new URL(link.value).searchParams.has("calc")).toBe(true);
    await user.clear(screen.getByLabelText("پیش‌پرداخت"));
    expect(screen.queryByLabelText("لینک محاسبه")).toBeNull();
    expect(screen.getByRole("button", { name: "کپی لینک محاسبه" }).hasAttribute("disabled")).toBe(true);
  });

  it("rejects an invalid shared loan and shows default inputs with an explicit notice", () => {
    location.search = new URLSearchParams({ calc: JSON.stringify({
      version: 1, vehicleName: "خودرو", comparisonMonths: [24, 36],
      input: { vehiclePrice: 1_000, downPayment: 2_000, annualInterestRate: 24, months: 12 },
    }) }).toString();
    render(<CalculatorFromUrl vehicles={vehicles} options={options} />);
    expect(screen.getByRole("alert").textContent).toContain("لینک محاسبه معتبر نیست");
    expect(screen.getByLabelText<HTMLInputElement>("پیش‌پرداخت").value).toBe("۳۰۰٬۰۰۰");
  });
});
