import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { getFinancingOptions, getVehicles, HttpError } from "../calculator-api";

const endpoints = [
  {
    path: "/api/vehicles",
    fetchData: getVehicles,
    valid: [{ id: "sample", name: "خودروی نمونه", price: 100_000_000 }],
    invalid: [{ id: "sample", name: "خودروی نمونه", price: "100000000" }],
  },
  {
    path: "/api/financing-options",
    fetchData: getFinancingOptions,
    valid: { annualInterestRate: 24, allowedMonths: [12, 24], currency: "IRT" },
    invalid: { annualInterestRate: 24, allowedMonths: [0], currency: "IRT" },
  },
];

afterEach(() => vi.unstubAllGlobals());

describe.each(endpoints)("$path API client", ({ path, fetchData, valid, invalid }) => {
  it("returns validated data and forwards the cancellation signal", async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json(valid));
    vi.stubGlobal("fetch", fetchMock);
    const controller = new AbortController();

    await expect(fetchData(controller.signal)).resolves.toEqual(valid);
    expect(fetchMock).toHaveBeenCalledWith(path, { signal: controller.signal });
  });

  it("rejects unsuccessful HTTP responses before trying to parse the body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Unavailable", { status: 503 })));

    await expect(fetchData()).rejects.toMatchObject({
      name: "HttpError",
      status: 503,
    } satisfies Partial<HttpError>);
  });

  it("rejects data that violates the response contract", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(invalid)));

    await expect(fetchData()).rejects.toBeInstanceOf(ZodError);
  });

  it("rejects malformed JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not JSON")));

    await expect(fetchData()).rejects.toBeInstanceOf(SyntaxError);
  });

  it("preserves network and cancellation errors", async () => {
    const error = new DOMException("Request cancelled", "AbortError");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));

    await expect(fetchData()).rejects.toBe(error);
  });
});

describe("response validation boundaries", () => {
  it("accepts an empty vehicle list for the UI empty state", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([])));
    await expect(getVehicles()).resolves.toEqual([]);
  });

  it.each([0, -1, 1.5, Number.MAX_SAFE_INTEGER + 1])("rejects invalid vehicle price %s", async (price) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([
      { id: "sample", name: "خودرو", price },
    ])));
    await expect(getVehicles()).rejects.toBeInstanceOf(ZodError);
  });

  it("rejects duplicate vehicle IDs", async () => {
    const vehicle = { id: "sample", name: "خودرو", price: 100 };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([vehicle, vehicle])));
    await expect(getVehicles()).rejects.toBeInstanceOf(ZodError);
  });

  it("accepts zero-interest financing", async () => {
    const options = { annualInterestRate: 0, allowedMonths: [12], currency: "IRT" };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(options)));
    await expect(getFinancingOptions()).resolves.toEqual(options);
  });

  it.each([
    { annualInterestRate: -1, allowedMonths: [12], currency: "IRT" },
    { annualInterestRate: 24, allowedMonths: [], currency: "IRT" },
    { annualInterestRate: 24, allowedMonths: [12, 12], currency: "IRT" },
    { annualInterestRate: 24, allowedMonths: [1.5], currency: "IRT" },
    { annualInterestRate: 24, allowedMonths: [12], currency: "IRR" },
  ])("rejects invalid financing options: %j", async (options) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(options)));
    await expect(getFinancingOptions()).rejects.toBeInstanceOf(ZodError);
  });
});
