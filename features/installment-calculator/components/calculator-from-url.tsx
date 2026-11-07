"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { VehiclesResponse } from "../types/vehicle-types";
import type { FinancingOptions } from "../types/financing-options-types";
import { readSharedCalculation } from "../lib/share-calculation";
import { CalculatorForm } from "./calculator-form";

interface CalculatorFromUrlProps {
  vehicles: VehiclesResponse;
  options: FinancingOptions;
}

export function CalculatorFromUrl({ vehicles, options }: CalculatorFromUrlProps) {
  const params = useSearchParams();
  const raw = params.get("calc");
  const shared = useMemo(() => readSharedCalculation(raw), [raw]);
  const effectiveOptions = useMemo(() => shared ? {
    ...options,
    annualInterestRate: shared.input.annualInterestRate,
    allowedMonths: [...new Set([
      ...options.allowedMonths, shared.input.months, ...shared.comparisonMonths,
    ])].sort((a, b) => a - b),
  } : options, [options, shared]);

  return (
    <>
      {raw !== null && !shared && <p role="alert" className="mb-5 text-sm text-destructive">لینک محاسبه معتبر نیست؛ اطلاعات پیش‌فرض نمایش داده می‌شود.</p>}
      {shared && <p className="mb-5 text-xs text-primary">محاسبه اشتراکی · قیمت و نرخ ذخیره‌شده در لینک</p>}
      <CalculatorForm key={raw ?? "default"} vehicles={vehicles} options={effectiveOptions} shared={shared ?? undefined} />
    </>
  );
}
