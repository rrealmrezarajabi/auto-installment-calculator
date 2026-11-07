import { queryOptions } from "@tanstack/react-query";
import { ZodError } from "zod";

import { getFinancingOptions, getVehicles, HttpError } from "./calculator-api";

const staleTime = 5 * 60 * 1000;

function retry(failureCount: number, error: Error): boolean {
  // Invalid contracts and client errors will not improve by repeating the request.
  if (error instanceof ZodError || error instanceof SyntaxError ||
    (error instanceof HttpError && error.status >= 400 && error.status < 500)) {
    return false;
  }

  return failureCount < 1;
}

export const calculatorQueries = {
  vehicles: () => queryOptions({
    queryKey: ["calculator", "vehicles"],
    queryFn: ({ signal }) => getVehicles(signal),
    staleTime,
    retry,
  }),
  financingOptions: () => queryOptions({
    queryKey: ["calculator", "financing-options"],
    queryFn: ({ signal }) => getFinancingOptions(signal),
    staleTime,
    retry,
  }),
};
