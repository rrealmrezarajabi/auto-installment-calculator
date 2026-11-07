"use client";

import { useController, useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useLayoutEffect, useRef } from "react";
import { formatCurrencyInput } from "../lib/format-currency-input";
import type { CalculatorFormValues } from "../types/calculator-form-types";
import { FieldFrame } from "./field-frame";

interface CurrencyFieldProps {
  name: "customPrice" | "downPayment";
  label: string;
}

export function CurrencyField({ name, label }: CurrencyFieldProps) {
  const { control } = useFormContext<CalculatorFormValues>();
  const { field, fieldState } = useController({ control, name });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pendingCaret = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingCaret.current !== null) {
      inputRef.current?.setSelectionRange(pendingCaret.current, pendingCaret.current);
      pendingCaret.current = null;
    }
  });

  return (
    <FieldFrame id={name} label={label} error={fieldState.error?.message}>
      <div className="relative">
        <Input {...field} id={name} inputMode="numeric" autoComplete="off" dir="ltr"
          ref={(element) => { inputRef.current = element; field.ref(element); }}
          className="h-12 rounded-xl bg-background/60 pe-3 ps-16 text-right tabular-nums"
          aria-invalid={fieldState.invalid} aria-describedby={`${name}-message`}
          onChange={(event) => {
            const input = event.currentTarget;
            const formatted = formatCurrencyInput(input.value, input.selectionStart ?? input.value.length);
            pendingCaret.current = formatted.caret;
            field.onChange(formatted.value);
            // Restore immediately too when formatting yields the same controlled value.
            input.value = formatted.value;
            input.setSelectionRange(formatted.caret, formatted.caret);
          }}
          onKeyDown={(event) => {
            const input = event.currentTarget;
            const caret = input.selectionStart;
            if (caret === null || caret !== input.selectionEnd) return;
            // Delete the adjacent digit instead of repeatedly recreating a removed separator.
            if (event.key === "Backspace" && input.value[caret - 1] === "٬") {
              input.setSelectionRange(caret - 1, caret - 1);
            } else if (event.key === "Delete" && input.value[caret] === "٬") {
              input.setSelectionRange(caret + 1, caret + 1);
            }
          }} />
        <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-muted-foreground">تومان</span>
      </div>
    </FieldFrame>
  );
}
