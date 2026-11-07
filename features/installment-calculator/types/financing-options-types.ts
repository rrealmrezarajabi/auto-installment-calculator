import type { z } from "zod";
import type { financingOptionsSchema } from "../schemas/financing-options-schema";

export type FinancingOptions = z.infer<typeof financingOptionsSchema>;
export type FinancingOptionsResponse = FinancingOptions;
