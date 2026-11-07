"use client";

import { useFormContext } from "react-hook-form";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { formatNumber } from "@/lib/format";
import type { CalculatorFormValues } from "../model/calculator-form-schema";
import type { FinancingOptions } from "../model/financing-options-types";
import { CurrencyField } from "./currency-field";
import { FieldFrame } from "./field-frame";

export function FinancingFields({ options }: { options: FinancingOptions }) {
  const { register, formState: { errors } } = useFormContext<CalculatorFormValues>();
  return (
    <fieldset className="space-y-4 border-t pt-6">
      <legend className="float-start mb-5 w-full text-sm font-semibold">شرایط پرداخت</legend>
      <div className="clear-both grid gap-3 sm:grid-cols-2">
        <CurrencyField name="downPayment" label="پیش‌پرداخت" />
        <FieldFrame id="months" label="مدت بازپرداخت" error={errors.months?.message}>
          <NativeSelect {...register("months")} id="months" className="h-12 w-full rounded-xl bg-background/60"
            aria-invalid={!!errors.months} aria-describedby="months-message">
            {options.allowedMonths.map((months) => (
              <NativeSelectOption key={months} value={months}>{formatNumber(months)} ماه</NativeSelectOption>
            ))}
          </NativeSelect>
        </FieldFrame>
      </div>
      <div className="flex items-center justify-between rounded-xl border border-primary/15 bg-secondary/50 px-4 py-3 text-sm text-secondary-foreground">
        <span>نرخ سود سالانه</span><span className="font-semibold">{formatNumber(options.annualInterestRate)}٪</span>
      </div>
    </fieldset>
  );
}
