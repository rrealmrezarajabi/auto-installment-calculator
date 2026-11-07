import { describe, expect, it } from "vitest";

import { GET } from "../route";

describe("GET /api/financing-options", () => {
  it("returns a successful JSON response", () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");
  });

  it("returns the documented financing policy in tomans and percentage units", async () => {
    const body: unknown = await GET().json();

    expect(body).toEqual({
      annualInterestRate: 24,
      allowedMonths: [12, 24, 36, 48],
      currency: "IRT",
    });
  });
});
