import type { z } from "zod";

import { financingOptionsSchema } from "../model/financing-options-schema";
import { vehiclesResponseSchema } from "../model/vehicle-schema";

export class HttpError extends Error {
  constructor(public readonly status: number) {
    super(`API request failed with status ${status}`);
    this.name = "HttpError";
  }
}

async function fetchValidated<T>(
  url: string,
  schema: z.ZodType<T>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const body: unknown = await response.json();
  return schema.parse(body);
}

export function getVehicles(signal?: AbortSignal) {
  return fetchValidated("/api/vehicles", vehiclesResponseSchema, signal);
}

export function getFinancingOptions(signal?: AbortSignal) {
  return fetchValidated("/api/financing-options", financingOptionsSchema, signal);
}
