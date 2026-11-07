// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { CalculatorForm } from "../calculator-form";

const vehicles = [
  { id: "first", name: "خودروی اول", price: 1_000 },
  { id: "second", name: "خودروی دوم", price: 200 },
];
const options = { annualInterestRate: 0, allowedMonths: [12, 24], currency: "IRT" } as const;

afterEach(cleanup);

describe("calculator form interactions", () => {
  it("updates table rows with the form and removes them for invalid or settled input", async () => {
    const user = userEvent.setup();
    render(<CalculatorForm vehicles={vehicles} options={options} />);
    expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(14);
    await user.selectOptions(screen.getByLabelText("مدت بازپرداخت"), "24");
    await waitFor(() => expect(within(screen.getByRole("table")).getAllByRole("row")).toHaveLength(26));
    const downPayment = screen.getByLabelText("پیش‌پرداخت");
    await user.clear(downPayment);
    expect(screen.queryByRole("table")).toBeNull();
    await user.type(downPayment, "400");
    expect(screen.getByTestId("monthly-payment").textContent).toBe("۲۵");
    const totals = within(screen.getByRole("table")).getByRole("row", { name: /جمع کل/ });
    expect(within(totals).getAllByRole("cell").map((cell) => cell.textContent))
      .toEqual(["۶۰۰", "۶۰۰", "۰", "۰"]);
    await user.clear(downPayment);
    await user.type(downPayment, "1000");
    expect(screen.queryByRole("table")).toBeNull();
    expect(screen.getByText("تسویه کامل؛ بدون اقساط")).toBeTruthy();
  });

  it("formats Latin digits while typing and preserves middle editing and separator deletion", async () => {
    const user = userEvent.setup();
    render(<CalculatorForm vehicles={[]} options={options} />);
    const price = screen.getByLabelText<HTMLInputElement>("قیمت خودرو");
    await user.type(price, "1234567");
    expect(price.value).toBe("۱٬۲۳۴٬۵۶۷");
    price.setSelectionRange(3, 3);
    await user.keyboard("9");
    expect(price.value).toBe("۱۲٬۹۳۴٬۵۶۷");
    expect(price.selectionStart).toBe(4);
    price.setSelectionRange(3, 3);
    await user.keyboard("{Backspace}");
    expect(price.value).toBe("۱٬۹۳۴٬۵۶۷");
    price.setSelectionRange(1, 1);
    await user.keyboard("{Delete}");
    expect(price.value).toBe("۱۳۴٬۵۶۷");
  });

  it("revalidates down payment when a cheaper vehicle is selected", async () => {
    const user = userEvent.setup();
    render(<CalculatorForm vehicles={vehicles} options={options} />);
    await user.selectOptions(screen.getByLabelText("خودرو"), "second");
    await screen.findByText("پیش‌پرداخت نباید بیشتر از قیمت خودرو باشد.");
    expect(screen.getByTestId("monthly-payment").textContent).toBe("—");
    expect(screen.getByLabelText("پیش‌پرداخت").getAttribute("aria-invalid")).toBe("true");
  });

  it("calculates manual vehicle data and accepts Persian grouped amounts", async () => {
    const user = userEvent.setup();
    render(<CalculatorForm vehicles={[]} options={options} />);
    await user.type(screen.getByLabelText("نام خودرو"), "خودروی سفارشی");
    await user.type(screen.getByLabelText("قیمت خودرو"), "۱٬۲۰۰");
    await waitFor(() => expect(screen.getByTestId("monthly-payment").textContent).toBe("۱۰۰"));
    expect(screen.getByText("خودروی سفارشی · ۱۲ ماه")).toBeTruthy();
    await user.clear(screen.getByLabelText("پیش‌پرداخت"));
    await user.type(screen.getByLabelText("پیش‌پرداخت"), "۱۲۰۰");
    await screen.findByText("تسویه کامل");
  });
});
