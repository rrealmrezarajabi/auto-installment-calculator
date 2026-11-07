import { z } from "zod";
import { calculatorInputSchema } from "./calculator-schema";

export const sharedCalculationSchema = z.object({
  version: z.literal(1),
  vehicleName: z.string().trim().min(1).max(120),
  input: calculatorInputSchema,
  comparisonMonths: z.tuple([
    z.number().int().min(1).max(600),
    z.number().int().min(1).max(600),
  ]),
});

