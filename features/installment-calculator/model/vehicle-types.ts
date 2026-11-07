import type { z } from "zod";
import type { vehicleSchema, vehiclesResponseSchema } from "./vehicle-schema";

export type Vehicle = z.infer<typeof vehicleSchema>;
export type VehiclesResponse = z.infer<typeof vehiclesResponseSchema>;
