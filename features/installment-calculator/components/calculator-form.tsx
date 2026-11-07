"use client";

import { FormProvider } from "react-hook-form";
import { useCalculatorForm } from "../hooks/use-calculator-form";
import type { VehiclesResponse } from "../model/vehicle-types";
import type { FinancingOptions } from "../model/financing-options-types";
import { FinancingFields } from "./financing-fields";
import { PaymentSummary } from "./payment-summary";
import { VehicleFields } from "./vehicle-fields";
import { AmortizationTable } from "./amortization-table";
import { ScenarioComparison } from "./scenario-comparison";
import { useScenarioComparison } from "../hooks/use-scenario-comparison";
import type { SharedCalculation } from "../model/shared-calculation-types";

interface CalculatorFormProps {
  vehicles: VehiclesResponse;
  options: FinancingOptions;
  shared?: SharedCalculation;
}

export function CalculatorForm({ vehicles, options, shared }: CalculatorFormProps) {
  const { form, result, input, vehicleName, months } = useCalculatorForm(vehicles, options, shared);
  const { scenarios, comparisonMonths, changeMonth } = useScenarioComparison(input, options.allowedMonths, shared?.comparisonMonths);
  const shareCalculation: SharedCalculation | null = input ? {
    version: 1, vehicleName, input, comparisonMonths: [...comparisonMonths],
  } : null;
  return (
    <FormProvider {...form}>
      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <form onSubmit={(event) => event.preventDefault()} noValidate
          aria-label="محاسبه اقساط خودرو" className="space-y-6 rounded-3xl border bg-card p-6 shadow-xl shadow-black/10 sm:p-8">
          <h2 className="border-b pb-5 text-lg font-semibold">اطلاعات خرید</h2>
          <VehicleFields vehicles={vehicles} />
          <FinancingFields options={options} />
        </form>
        <PaymentSummary result={result} vehicleName={vehicleName} months={months} shareCalculation={shareCalculation} />
      </div>
      <ScenarioComparison scenarios={scenarios} allowedMonths={options.allowedMonths} currentMonths={months}
        onChange={changeMonth} onApply={(duration) => form.setValue("months", String(duration), { shouldValidate: true })} />
      <AmortizationTable result={result} />
    </FormProvider>
  );
}
