import type { VehiclesResponse } from "../model/vehicle-types";
import type { FinancingOptions } from "../model/financing-options-types";
import { FinancingFields } from "./financing-fields";
import { VehicleFields } from "./vehicle-fields";

interface PurchaseFormProps {
  vehicles: VehiclesResponse;
  options: FinancingOptions;
}

export function PurchaseForm({ vehicles, options }: PurchaseFormProps) {
  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate aria-label="محاسبه اقساط خودرو"
      className="space-y-6 rounded-3xl border bg-card p-6 shadow-xl shadow-black/10 sm:p-8">
      <h2 className="border-b pb-5 text-lg font-semibold">اطلاعات خرید</h2>
      <VehicleFields vehicles={vehicles} />
      <FinancingFields options={options} />
    </form>
  );
}
