import type { z } from "zod";
import type { sharedCalculationSchema } from "./shared-calculation-schema";

export type SharedCalculation = z.infer<typeof sharedCalculationSchema>;
