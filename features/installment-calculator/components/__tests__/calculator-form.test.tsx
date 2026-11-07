// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
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
  it("updates the installment as the down payment changes and hides invalid results", async () => {
    const user = userEvent.setup();
    render(<CalculatorForm vehicles={vehicles} options={options} />);
    expect(screen.getByTestId("monthly-payment").textContent).toBe("۵۸");
    const downPayment = screen.getByLabelText("پیش‌پرداخت");
    await user.clear(downPayment);
    expect(screen.getByTestId("monthly-payment").textContent).toBe("—");
    await user.type(downPayment, "۴۰۰");
    await waitFor(() => expect(screen.getByTestId("monthly-payment").textContent).toBe("۵۰"));
    await user.selectOptions(screen.getByLabelText("مدت بازپرداخت"), "24");
    await waitFor(() => expect(screen.getByTestId("monthly-payment").textContent).toBe("۲۵"));
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
    await screen.findByText("با این پیش‌پرداخت، مبلغ خودرو کامل تسویه می‌شود و قسطی ندارید.");
  });
});
