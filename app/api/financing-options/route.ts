import { NextResponse } from "next/server";

import type { FinancingOptionsResponse } from "@/features/installment-calculator/model/financing-options-types";
import { financingOptions } from "@/server/data/financing-options";

export function GET(): NextResponse<FinancingOptionsResponse> {
  return NextResponse.json<FinancingOptionsResponse>(financingOptions);
}
