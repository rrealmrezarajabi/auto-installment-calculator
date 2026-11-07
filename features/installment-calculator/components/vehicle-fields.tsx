"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { formatNumber } from "@/lib/format";
import type { CalculatorFormValues } from "../model/calculator-form-schema";
import type { VehiclesResponse } from "../model/vehicle-types";
import { CurrencyField } from "./currency-field";
import { FieldFrame } from "./field-frame";

function CatalogVehicleField({ vehicles }: { vehicles: VehiclesResponse }) {
  const { register, control, formState: { errors } } = useFormContext<CalculatorFormValues>();
  const vehicleId = useWatch({ control, name: "vehicleId" });
  const selected = vehicles.find(({ id }) => id === vehicleId);

  return (
    <FieldFrame id="vehicleId" label="خودرو" error={errors.vehicleId?.message}
      hint={selected ? `قیمت خودرو: ${formatNumber(selected.price)} تومان` : "فهرست خودروها خالی است؛ از ورود دستی استفاده کنید."}>
      <NativeSelect {...register("vehicleId")} id="vehicleId" className="h-12 w-full rounded-xl bg-background/60"
        aria-invalid={!!errors.vehicleId} aria-describedby="vehicleId-message">
        <NativeSelectOption value="">انتخاب خودرو</NativeSelectOption>
        {vehicles.map((vehicle) => <NativeSelectOption key={vehicle.id} value={vehicle.id}>{vehicle.name}</NativeSelectOption>)}
      </NativeSelect>
    </FieldFrame>
  );
}

function ManualVehicleFields() {
  const { register, formState: { errors } } = useFormContext<CalculatorFormValues>();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <FieldFrame id="customName" label="نام خودرو" error={errors.customName?.message}>
        <Input {...register("customName")} id="customName" placeholder="مثلاً تارا اتوماتیک"
          className="h-12 rounded-xl bg-background/60" aria-invalid={!!errors.customName} aria-describedby="customName-message" />
      </FieldFrame>
      <CurrencyField name="customPrice" label="قیمت خودرو" />
    </div>
  );
}

export function VehicleFields({ vehicles }: { vehicles: VehiclesResponse }) {
  const { control, setValue } = useFormContext<CalculatorFormValues>();
  const mode = useWatch({ control, name: "mode" });

  return (
    <fieldset className="space-y-5">
      <legend className="mb-4 text-sm font-semibold">انتخاب خودرو</legend>
      {vehicles.length === 0 && <p className="text-xs leading-6 text-muted-foreground">فهرست خودروها خالی است.</p>}
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1" role="group" aria-label="روش انتخاب خودرو">
        {([['catalog', 'انتخاب از فهرست'], ['manual', 'ورود دستی']] as const).map(([value, label]) => (
          <Button key={value} type="button" variant="ghost" aria-pressed={mode === value}
            className={`h-11 rounded-lg ${mode === value ? "bg-primary/15 text-primary shadow-sm hover:bg-primary/20" : "text-muted-foreground"}`}
            onClick={() => setValue("mode", value, { shouldValidate: true })}>{label}</Button>
        ))}
      </div>
      {mode === "manual" ? <ManualVehicleFields /> : <CatalogVehicleField vehicles={vehicles} />}
    </fieldset>
  );
}
