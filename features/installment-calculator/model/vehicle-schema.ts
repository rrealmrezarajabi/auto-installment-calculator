import { z } from "zod";

export const vehicleSchema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1),
  /** Fictional price in whole tomans. */
  price: z.number().int().positive(),
}).readonly();

export const vehiclesResponseSchema = z.array(vehicleSchema)
  .refine((vehicles) => new Set(vehicles.map(({ id }) => id)).size === vehicles.length, {
    message: "Vehicle IDs must be unique",
  })
  .readonly();
