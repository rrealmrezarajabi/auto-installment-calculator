import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { calculatorQueries } from "../calculator-queries";

afterEach(() => vi.unstubAllGlobals());

describe("calculator queries", () => {
  it("caches each resource independently and reuses fresh data", async () => {
    const client = new QueryClient();
    const vehicles = [{ id: "sample", name: "خودرو", price: 100 }];
    const financing = { annualInterestRate: 24, allowedMonths: [12], currency: "IRT" };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(vehicles))
      .mockResolvedValueOnce(Response.json(financing));
    vi.stubGlobal("fetch", fetchMock);

    try {
      await expect(client.fetchQuery(calculatorQueries.vehicles())).resolves.toEqual(vehicles);
      await expect(client.fetchQuery(calculatorQueries.financingOptions())).resolves.toEqual(financing);
      await expect(client.fetchQuery(calculatorQueries.vehicles())).resolves.toEqual(vehicles);
      await expect(client.fetchQuery(calculatorQueries.financingOptions())).resolves.toEqual(financing);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      client.clear();
    }
  });

  it("retries a transient server failure once", async () => {
    const client = new QueryClient();
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(null, { status: 503 }))
      .mockResolvedValueOnce(Response.json([]));
    vi.stubGlobal("fetch", fetchMock);

    try {
      await expect(client.fetchQuery({
        ...calculatorQueries.vehicles(), retryDelay: 0,
      })).resolves.toEqual([]);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    } finally {
      client.clear();
    }
  });

  it.each([
    { name: "client error", response: () => new Response(null, { status: 404 }), error: Error },
    { name: "invalid contract", response: () => Response.json({ vehicles: [] }), error: ZodError },
    { name: "malformed JSON", response: () => new Response("invalid"), error: SyntaxError },
  ])("does not retry $name", async ({ response, error }) => {
    const client = new QueryClient();
    const fetchMock = vi.fn().mockImplementation(async () => response());
    vi.stubGlobal("fetch", fetchMock);

    try {
      await expect(client.fetchQuery({
        ...calculatorQueries.vehicles(), retryDelay: 0,
      })).rejects.toBeInstanceOf(error);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(client.getQueryData(calculatorQueries.vehicles().queryKey)).toBeUndefined();
    } finally {
      client.clear();
    }
  });
});
