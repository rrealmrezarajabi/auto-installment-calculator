import { describe, expect, it } from "vitest";

import { GET } from "./route";

describe("GET /api/vehicles", () => {
  it("returns a successful JSON response", () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("returns selectable vehicles with unique IDs and positive whole-toman prices", async () => {
    const body: unknown = await GET().json();

    expect(Array.isArray(body)).toBe(true);
    if (!Array.isArray(body)) {
      throw new Error("Expected a vehicle array");
    }

    expect(body.length).toBeGreaterThan(0);

    for (const vehicle of body) {
      expect(vehicle).toEqual({
        id: expect.any(String),
        name: expect.any(String),
        price: expect.any(Number),
      });
      expect(vehicle.id.trim().length).toBeGreaterThan(0);
      expect(vehicle.name.trim().length).toBeGreaterThan(0);
      expect(Number.isSafeInteger(vehicle.price)).toBe(true);
      expect(vehicle.price).toBeGreaterThan(0);
    }

    expect(new Set(body.map((vehicle) => vehicle.id)).size).toBe(body.length);
  });
});
