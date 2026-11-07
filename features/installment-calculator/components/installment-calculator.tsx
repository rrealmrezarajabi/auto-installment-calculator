"use client";

import { useCalculatorData } from "../hooks/use-calculator-data";
import { CalculatorForm } from "./calculator-form";
import { CalculatorLoading } from "./calculator-loading";
import { DataNotice } from "./data-notice";

export function InstallmentCalculator() {
  const { vehicles, financing } = useCalculatorData();

  if (financing.isPending || vehicles.isPending) return <CalculatorLoading />;

  if (!financing.data) {
    return <DataNotice message="دریافت شرایط فروش ممکن نشد. برای محاسبه اقساط دوباره تلاش کنید."
      retry={() => { void financing.refetch(); }} pending={financing.isFetching} />;
  }

  return (
    <>
      {financing.isError && <DataNotice message="به‌روزرسانی شرایط فروش انجام نشد؛ آخرین شرایط دریافت‌شده نمایش داده می‌شود."
        retry={() => { void financing.refetch(); }} pending={financing.isFetching} />}
      {vehicles.isError && <DataNotice message="فهرست خودروها دریافت نشد. می‌توانید از ورود دستی استفاده کنید."
        retry={() => { void vehicles.refetch(); }} pending={vehicles.isFetching} />}
      <CalculatorForm vehicles={vehicles.data ?? []} options={financing.data} />
    </>
  );
}
