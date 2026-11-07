import { NextResponse } from "next/server";

import type { VehiclesResponse } from "@/features/installment-calculator/types/vehicle-types";
import { vehicles } from "@/server/data/vehicles";

export function GET(): NextResponse<VehiclesResponse> {
  return NextResponse.json<VehiclesResponse>(vehicles);
}
