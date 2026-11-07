"use client";

import { FormProvider } from "react-hook-form";
import { useCalculatorForm } from "../hooks/use-calculator-form";
import type { VehiclesResponse } from "../model/vehicle-types";
import type { FinancingOptions } from "../model/financing-options-types";
import { FinancingFields } from "./financing-fields";
import { PaymentSummary } from "./payment-summary";
import { VehicleFields } from "./vehicle-fields";
import { AmortizationTable } from "./amortization-table";

interface CalculatorFormProps {
  vehicles: VehiclesResponse;
  options: FinancingOptions;
}

export function CalculatorForm({ vehicles, options }: CalculatorFormProps) {
  const { form, result, vehicleName, months } = useCalculatorForm(vehicles, options);
  return (
    <FormProvider {...form}>
      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <form onSubmit={(event) => event.preventDefault()} noValidate
          aria-label="محاسبه اقساط خودرو" className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
          <div><h2 className="text-lg font-semibold">اطلاعات خرید</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">خودرو و شرایط پرداخت را انتخاب کنید.</p></div>
          <VehicleFields vehicles={vehicles} />
          <FinancingFields options={options} />
          <p className="border-t pt-5 text-xs leading-6 text-muted-foreground">محاسبات با هر تغییر به‌روز می‌شوند؛ نیازی به زدن دکمه نیست.</p>
        </form>
        <PaymentSummary result={result} vehicleName={vehicleName} months={months} />
      </div>
      <AmortizationTable result={result} />
    </FormProvider>
  );
}
