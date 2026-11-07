import type { Vehicle } from "@/features/installment-calculator/types/vehicle-types";

// A fixed sample of market prices, not a live pricing feed.
export const vehiclePriceReference = {
  sourceUrl: "https://car.ir/prices",
  capturedAt: "2026-11-07",
} as const;

export const vehicles = [
  { id: "tara-manual-1403", name: "تارا دنده‌ای مدل ۱۴۰۳", price: 2_850_000_000 },
  { id: "tara-v4-1404", name: "تارا اتوماتیک V4 مدل ۱۴۰۴", price: 4_050_000_000 },
  { id: "dena-plus-1404", name: "دنا پلاس مدل ۱۴۰۴", price: 3_100_000_000 },
  { id: "peugeot-207-manual-1404", name: "پژو ۲۰۷ دستی مدل ۱۴۰۴", price: 2_800_000_000 },
  { id: "quick-s-1404", name: "کوییک S مدل ۱۴۰۴", price: 1_785_000_000 },
  { id: "saina-s-1404", name: "ساینا S مدل ۱۴۰۴", price: 1_765_000_000 },
  { id: "shahin-manual-1404", name: "شاهین دنده‌ای مدل ۱۴۰۴", price: 2_900_000_000 },
  { id: "shahin-automatic-1404", name: "شاهین اتوماتیک مدل ۱۴۰۴", price: 3_200_000_000 },
  { id: "mvm-x22-pro-manual-1404", name: "ام‌وی‌ام X22 پرو دنده‌ای مدل ۱۴۰۴", price: 3_500_000_000 },
  { id: "mvm-x55-pro-1404", name: "ام‌وی‌ام X55 پرو مدل ۱۴۰۴", price: 5_600_000_000 },
  { id: "kmc-j7-1404", name: "کی‌ام‌سی J7 مدل ۱۴۰۴", price: 6_950_000_000 },
  { id: "tiggo-7-pro-1404", name: "تیگو ۷ پرو مدل ۱۴۰۴", price: 7_500_000_000 },
] as const satisfies readonly Vehicle[];
