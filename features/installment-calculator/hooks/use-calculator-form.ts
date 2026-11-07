"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { formatNumber } from "@/lib/format";
import { calculateInstallments } from "../lib/calculate-installments";
import { createCalculatorFormSchema } from "../schemas/calculator-form-schema";
import type { CalculatorFormOutput, CalculatorFormValues } from "../types/calculator-form-types";
import type { VehiclesResponse } from "../types/vehicle-types";
import type { FinancingOptions } from "../types/financing-options-types";
import type { SharedCalculation } from "../types/shared-calculation-types";

export function useCalculatorForm(vehicles: VehiclesResponse, options: FinancingOptions, shared?: SharedCalculation) {
  const schema = useMemo(() => createCalculatorFormSchema(vehicles, options), [vehicles, options]);
  const form = useForm<CalculatorFormValues, unknown, CalculatorFormOutput>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      mode: shared || !vehicles.length ? "manual" : "catalog",
      vehicleId: vehicles[0]?.id ?? "",
      customName: shared?.vehicleName ?? "",
      customPrice: shared ? formatNumber(shared.input.vehiclePrice) : "",
      downPayment: formatNumber(shared?.input.downPayment ?? Math.round((vehicles[0]?.price ?? 0) * 0.3)),
      months: String(shared?.input.months ?? options.allowedMonths[0]),
    },
  });
  const values = useWatch({ control: form.control });
  const { trigger } = form;
  // Price, selection, and down payment depend on each other, so validate the full form.
  useEffect(() => { void trigger(); }, [values, trigger]);
  const parsed = schema.safeParse(values);
  const result = parsed.success ? calculateInstallments(parsed.data.calculatorInput) : null;

  return {
    form, result,
    input: parsed.success && result?.success ? parsed.data.calculatorInput : null,
    vehicleName: parsed.success ? parsed.data.vehicleName : "",
    months: parsed.success ? parsed.data.calculatorInput.months : null,
  };
}
