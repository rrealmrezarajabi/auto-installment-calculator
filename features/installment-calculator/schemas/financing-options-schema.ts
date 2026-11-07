import { z } from "zod";

export const financingOptionsSchema = z.object({
  /** Annual percentage: 24 means 24%, not 0.24. Zero-interest financing is valid. */
  annualInterestRate: z.number().nonnegative(),
  allowedMonths: z.array(z.number().int().positive()).min(1)
    .refine((months) => new Set(months).size === months.length, {
      message: "Financing terms must be unique",
    }).readonly(),
  /** IRT denotes toman throughout this application. */
  currency: z.literal("IRT"),
}).readonly();
