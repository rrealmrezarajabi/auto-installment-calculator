"use client";

import { useController, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { formatNumber, parseWholeAmount } from "@/lib/format";
import type { CalculatorFormValues } from "../model/calculator-form-schema";
import { FieldFrame } from "./field-frame";

interface CurrencyFieldProps {
  name: "customPrice" | "downPayment";
  label: string;
  hint?: string;
}

export function CurrencyField({ name, label, hint }: CurrencyFieldProps) {
  const { control } = useFormContext<CalculatorFormValues>();
  const { field, fieldState } = useController({ control, name });

  return (
    <FieldFrame id={name} label={label} error={fieldState.error?.message} hint={hint}>
      <div className="relative">
        <Input {...field} id={name} inputMode="numeric" autoComplete="off" dir="ltr"
          className="h-12 rounded-xl bg-white pe-3 ps-16 text-right tabular-nums"
          aria-invalid={fieldState.invalid} aria-describedby={`${name}-message`}
          onBlur={() => {
            const amount = parseWholeAmount(field.value);
            if (Number.isFinite(amount)) field.onChange(formatNumber(amount));
            field.onBlur();
          }} />
        <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-muted-foreground">تومان</span>
      </div>
    </FieldFrame>
  );
}
