import type { z } from "zod";
import type { createCalculatorFormSchema } from "../schemas/calculator-form-schema";

export type CalculatorFormValues = z.input<ReturnType<typeof createCalculatorFormSchema>>;
export type CalculatorFormOutput = z.output<ReturnType<typeof createCalculatorFormSchema>>;
