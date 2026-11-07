import { z } from "zod";

export const calculatorInputSchema = z.object({
  vehiclePrice: z.number().int().positive({ message: "قیمت خودرو باید مثبت باشد." }),
  downPayment: z.number().int().nonnegative({ message: "پیش‌پرداخت نمی‌تواند منفی باشد." }),
  annualInterestRate: z.number().nonnegative({ message: "نرخ سود نمی‌تواند منفی باشد." }),
  months: z.number().int().min(1).max(600),
}).refine(({ downPayment, vehiclePrice }) => downPayment <= vehiclePrice, {
  path: ["downPayment"],
  message: "پیش‌پرداخت نباید بیشتر از قیمت خودرو باشد.",
}).readonly();
