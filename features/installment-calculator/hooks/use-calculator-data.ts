"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { calculatorQueries } from "../api/calculator-queries";

export function useCalculatorData() {
  const vehicles = useQuery(calculatorQueries.vehicles());
  const financing = useQuery(calculatorQueries.financingOptions());
  const { isError: vehiclesError, isSuccess: vehiclesSuccess, errorUpdatedAt: vehiclesErrorAt, refetch: retryVehicles } = vehicles;
  const { isError: financingError, isSuccess: financingSuccess, errorUpdatedAt: financingErrorAt, refetch: retryFinancing } = financing;

  useEffect(() => {
    if (vehiclesError) {
      toast.error("دریافت فهرست خودروها انجام نشد.", {
        id: "vehicles-error", description: "می‌توانید اطلاعات خودرو را دستی وارد کنید.",
        action: { label: "تلاش مجدد", onClick: () => { void retryVehicles(); } },
      });
    } else if (vehiclesSuccess) toast.dismiss("vehicles-error");
  }, [vehiclesError, vehiclesSuccess, vehiclesErrorAt, retryVehicles]);

  useEffect(() => {
    if (financingError) {
      toast.error("دریافت شرایط فروش انجام نشد.", {
        id: "financing-error",
        action: { label: "تلاش مجدد", onClick: () => { void retryFinancing(); } },
      });
    } else if (financingSuccess) toast.dismiss("financing-error");
  }, [financingError, financingSuccess, financingErrorAt, retryFinancing]);

  return { vehicles, financing };
}
