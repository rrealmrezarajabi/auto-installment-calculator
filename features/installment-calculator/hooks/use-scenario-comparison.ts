"use client";

import { useState } from "react";
import type { CalculatorInput } from "../types/calculator-types";
import { calculateInstallments } from "../lib/calculate-installments";

export function useScenarioComparison(
  input: CalculatorInput | null,
  allowedMonths: readonly number[],
  initial?: readonly [number, number],
) {
  const [comparisonMonths, setComparisonMonths] = useState<readonly [number, number]>(() => {
    if (initial) return initial;
    const first = allowedMonths.includes(24) ? 24 : allowedMonths[0];
    const second = allowedMonths.includes(36) ? 36 : (allowedMonths.find((month) => month !== first) ?? first);
    return [first, second];
  });
  const scenarios = comparisonMonths.map((months) => {
    const result = input ? calculateInstallments({ ...input, months }) : null;
    return { months, result };
  });

  function changeMonth(index: number, months: number) {
    if (!allowedMonths.includes(months)) return;
    setComparisonMonths(([first, second]) => {
      if (months === (index === 0 ? second : first)) return [first, second];
      return index === 0 ? [months, second] : [first, months];
    });
  }

  return { comparisonMonths, scenarios, changeMonth };
}
