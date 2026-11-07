import type { FinancingOptions } from "@/features/installment-calculator/model/financing-options-types";

export const financingOptions = {
  annualInterestRate: 24,
  allowedMonths: [12, 24, 36, 48],
  currency: "IRT",
} as const satisfies FinancingOptions;
