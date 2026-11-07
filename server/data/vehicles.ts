import type { Vehicle } from "@/features/installment-calculator/model/vehicle-types";

// Sample prices for the technical task; these are not market prices.
export const vehicles = [
  { id: "tara-v1", name: "تارا V1", price: 950_000_000 },
  { id: "dena-plus", name: "دنا پلاس", price: 1_100_000_000 },
  { id: "peugeot-207", name: "پژو ۲۰۷", price: 850_000_000 },
  { id: "shahin-g", name: "شاهین G", price: 780_000_000 },
  { id: "quick-gx", name: "کوییک GX", price: 450_000_000 },
] as const satisfies readonly Vehicle[];
