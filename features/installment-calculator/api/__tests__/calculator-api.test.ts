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

  it("rejects data that violates the response contract", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(invalid)));

    await expect(fetchData()).rejects.toBeInstanceOf(ZodError);
  });

});

describe("HTTP errors", () => {
  it("keeps the status code without parsing an unsuccessful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("Unavailable", { status: 503 })));
    await expect(getVehicles()).rejects.toMatchObject({
      name: "HttpError", status: 503,
    } satisfies Partial<HttpError>);
  });
});
