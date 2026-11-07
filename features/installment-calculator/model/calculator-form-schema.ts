import { z } from "zod";
import { parseWholeAmount } from "@/lib/format";
import type { VehiclesResponse } from "./vehicle-types";
import type { FinancingOptions } from "./financing-options-types";

export function createCalculatorFormSchema(vehicles: VehiclesResponse, options: FinancingOptions) {
  return z.object({
    mode: z.enum(["catalog", "manual"]),
    vehicleId: z.string(),
    customName: z.string(),
    customPrice: z.string(),
    downPayment: z.string(),
    months: z.string(),
  }).superRefine((values, ctx) => {
    const vehicle = vehicles.find(({ id }) => id === values.vehicleId);
    const price = values.mode === "manual" ? parseWholeAmount(values.customPrice) : vehicle?.price;
    const downPayment = parseWholeAmount(values.downPayment);
    const months = parseWholeAmount(values.months);
    const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });

    if (values.mode === "catalog" && !vehicle) issue("vehicleId", "یک خودرو انتخاب کنید یا از ورود دستی استفاده کنید.");
    if (values.mode === "manual") {
      if (!values.customName.trim()) issue("customName", "نام خودرو را وارد کنید.");
      else if (values.customName.trim().length > 120) issue("customName", "نام خودرو حداکثر ۱۲۰ نویسه باشد.");
      if (!Number.isFinite(price) || !price || price <= 0) issue("customPrice", "قیمت را به تومان و به صورت عدد صحیح مثبت وارد کنید.");
    }
    if (!Number.isFinite(downPayment)) issue("downPayment", "پیش‌پرداخت را به صورت عدد صحیح صفر یا بیشتر وارد کنید.");
    else if (price !== undefined && downPayment > price) issue("downPayment", "پیش‌پرداخت نباید بیشتر از قیمت خودرو باشد.");
    if (!options.allowedMonths.includes(months) || months > 600) issue("months", "یکی از مدت‌های مجاز را انتخاب کنید.");
  }).transform((values) => {
    const vehicle = vehicles.find(({ id }) => id === values.vehicleId);
    return {
      vehicleName: values.mode === "manual" ? values.customName.trim() : vehicle!.name,
      calculatorInput: {
        vehiclePrice: values.mode === "manual" ? parseWholeAmount(values.customPrice) : vehicle!.price,
        downPayment: parseWholeAmount(values.downPayment),
        annualInterestRate: options.annualInterestRate,
        months: parseWholeAmount(values.months),
      },
    };
  });
}

export type CalculatorFormValues = z.input<ReturnType<typeof createCalculatorFormSchema>>;
export type CalculatorFormOutput = z.output<ReturnType<typeof createCalculatorFormSchema>>;
