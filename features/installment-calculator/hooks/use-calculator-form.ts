"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { formatNumber } from "@/lib/format";
import { calculateInstallments } from "../lib/calculate-installments";
import { createCalculatorFormSchema, type CalculatorFormOutput, type CalculatorFormValues } from "../model/calculator-form-schema";
import type { VehiclesResponse } from "../model/vehicle-types";
import type { FinancingOptions } from "../model/financing-options-types";

export function useCalculatorForm(vehicles: VehiclesResponse, options: FinancingOptions) {
  const schema = useMemo(() => createCalculatorFormSchema(vehicles, options), [vehicles, options]);
  const form = useForm<CalculatorFormValues, unknown, CalculatorFormOutput>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      mode: vehicles.length ? "catalog" : "manual",
      vehicleId: vehicles[0]?.id ?? "",
      customName: "", customPrice: "",
      downPayment: formatNumber(Math.round((vehicles[0]?.price ?? 0) * 0.3)),
      months: String(options.allowedMonths[0]),
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
    vehicleName: parsed.success ? parsed.data.vehicleName : "",
    months: parsed.success ? parsed.data.calculatorInput.months : null,
  };
}
