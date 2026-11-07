import { sharedCalculationSchema } from "../schemas/shared-calculation-schema";
import type { SharedCalculation } from "../types/shared-calculation-types";
import { calculateInstallments } from "./calculate-installments";

export function readSharedCalculation(raw: string | null): SharedCalculation | null {
  if (raw === null) return null;
  try {
    const parsed = sharedCalculationSchema.safeParse(JSON.parse(raw));
    if (!parsed.success || !calculateInstallments(parsed.data.input).success) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export function createCalculationUrl(baseUrl: string, calculation: SharedCalculation): string {
  const validated = sharedCalculationSchema.parse(calculation);
  const url = new URL(baseUrl);
  url.search = "";
  url.hash = "";
  url.searchParams.set("calc", JSON.stringify(validated));
  return url.toString();
}
