import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/lib/format";
import type { CalculatorInput } from "../model/calculator-types";

interface PurchaseContextProps {
  input: CalculatorInput | null;
  vehicleName: string;
  onEdit: () => void;
}

export function PurchaseContext({ input, vehicleName, onEdit }: PurchaseContextProps) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border bg-card/70 p-4 sm:px-6">
      {input ? <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs">
        <span className="text-sm font-medium">{vehicleName}</span>
        <span className="text-muted-foreground">قیمت <span className="ms-1 text-foreground tabular-nums">{formatNumber(input.vehiclePrice)} تومان</span></span>
        <span className="text-muted-foreground">پیش‌پرداخت <span className="ms-1 text-foreground tabular-nums">{formatNumber(input.downPayment)} تومان</span></span>
        <span className="text-muted-foreground">نرخ سالانه <span className="ms-1 text-primary">{formatNumber(input.annualInterestRate)}٪</span></span>
      </div> : <p className="text-sm text-muted-foreground">اطلاعات خرید را تکمیل کنید.</p>}
      <Button type="button" variant="ghost" className="h-11 shrink-0 text-primary" onClick={onEdit}>
        <Pencil size={15} aria-hidden="true" />ویرایش اطلاعات
      </Button>
    </div>
  );
}
