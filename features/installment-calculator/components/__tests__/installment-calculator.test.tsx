// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { InstallmentCalculator } from "../installment-calculator";

vi.mock("sonner", () => ({ toast: { error: vi.fn(), dismiss: vi.fn() } }));

const clients: QueryClient[] = [];
const options = { annualInterestRate: 24, allowedMonths: [12, 24], currency: "IRT" };

function renderCalculator() {
  const client = new QueryClient();
  clients.push(client);
  return render(<QueryClientProvider client={client}><InstallmentCalculator /></QueryClientProvider>);
}

afterEach(() => {
  cleanup();
  clients.splice(0).forEach((client) => client.clear());
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe("calculator data states", () => {
  it("shows an accessible loading state while requests are pending", () => {
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>(() => {})));
    renderCalculator();
    expect(screen.getByRole("status", { name: "در حال دریافت اطلاعات" })).toBeTruthy();
    expect(screen.queryByRole("form")).toBeNull();
  });

  it("offers manual entry when vehicles fail and notifies through Sonner", async () => {
    vi.stubGlobal("fetch", vi.fn(async (url: string) => url === "/api/vehicles"
      ? new Response(null, { status: 404 }) : Response.json(options)));
    renderCalculator();

    await screen.findByLabelText("نام خودرو");
    expect(screen.getByRole("alert").textContent).toContain("ورود دستی");
    expect(toast.error).toHaveBeenCalledWith("دریافت فهرست خودروها انجام نشد.", expect.objectContaining({
      id: "vehicles-error", action: expect.objectContaining({ label: "تلاش مجدد" }),
    }));
  });

  it("blocks missing financing data and recovers after retry", async () => {
    const user = userEvent.setup();
    let financingAvailable = false;
    vi.stubGlobal("fetch", vi.fn(async (url: string) => {
      if (url === "/api/vehicles") return Response.json([]);
      return financingAvailable ? Response.json(options) : new Response(null, { status: 404 });
    }));
    renderCalculator();

    await screen.findByRole("alert");
    expect(screen.queryByRole("form")).toBeNull();
    expect(toast.error).toHaveBeenCalledWith("دریافت شرایط فروش انجام نشد.", expect.objectContaining({ id: "financing-error" }));
    financingAvailable = true;
    await user.click(screen.getByRole("button", { name: "تلاش مجدد" }));
    await screen.findByRole("form", { name: "محاسبه اقساط خودرو" });
    await waitFor(() => expect(toast.dismiss).toHaveBeenCalledWith("financing-error"));
  });
});
