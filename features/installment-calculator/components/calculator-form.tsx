"use client";

import { FormProvider } from "react-hook-form";
import { useState } from "react";
import { useCalculatorForm } from "../hooks/use-calculator-form";
import type { VehiclesResponse } from "../model/vehicle-types";
import type { FinancingOptions } from "../model/financing-options-types";
import { PaymentSummary } from "./payment-summary";
import { AmortizationTable } from "./amortization-table";
import { ScenarioComparison } from "./scenario-comparison";
import { useScenarioComparison } from "../hooks/use-scenario-comparison";
import type { SharedCalculation } from "../model/shared-calculation-types";
import type { CalculatorView } from "../model/calculator-view-types";
import { CalculatorWorkspace } from "./calculator-workspace";
import { PurchaseContext } from "./purchase-context";
import { PurchaseForm } from "./purchase-form";

interface CalculatorFormProps {
  vehicles: VehiclesResponse;
  options: FinancingOptions;
  shared?: SharedCalculation;
}

export function CalculatorForm({ vehicles, options, shared }: CalculatorFormProps) {
  const [view, setView] = useState<CalculatorView>("calculator");
  const { form, result, input, vehicleName, months } = useCalculatorForm(vehicles, options, shared);
  const { scenarios, comparisonMonths, changeMonth } = useScenarioComparison(input, options.allowedMonths, shared?.comparisonMonths);
  const shareCalculation: SharedCalculation | null = input ? {
    version: 1, vehicleName, input, comparisonMonths: [...comparisonMonths],
  } : null;
  return (
    <FormProvider {...form}>
      <CalculatorWorkspace view={view} onViewChange={setView}>
        <div id="panel-calculator" role="region" aria-labelledby="nav-calculator" hidden={view !== "calculator"}>
          <div className="grid items-start gap-5 xl:grid-cols-[1.1fr_1fr]">
            <PurchaseForm vehicles={vehicles} options={options} />
            <PaymentSummary result={result} vehicleName={vehicleName} months={months} shareCalculation={shareCalculation} />
          </div>
        </div>
        {view !== "calculator" && <PurchaseContext input={input} vehicleName={vehicleName} onEdit={() => setView("calculator")} />}
        <div id="panel-comparison" role="region" aria-labelledby="nav-comparison" hidden={view !== "comparison"}>
          <ScenarioComparison scenarios={scenarios} allowedMonths={options.allowedMonths} currentMonths={months}
            onChange={changeMonth} onApply={(duration) => {
              form.setValue("months", String(duration), { shouldValidate: true });
              setView("schedule");
            }} />
        </div>
        <div id="panel-schedule" role="region" aria-labelledby="nav-schedule" hidden={view !== "schedule"}>
          <AmortizationTable result={result} />
        </div>
      </CalculatorWorkspace>
    </FormProvider>
  );
}
