import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/format";
import type { CalculationResult } from "../model/calculator-types";

interface ScenarioCardProps {
  index: number;
  months: number;
  result: CalculationResult | null;
  allowedMonths: readonly number[];
  otherMonths: number;
  selected: boolean;
  onChange: (months: number) => void;
  onApply: () => void;
}

export function ScenarioCard({ index, months, result, allowedMonths, otherMonths, selected, onChange, onApply }: ScenarioCardProps) {
  const data = result?.success ? result.data : null;
  return (
    <article aria-label={`سناریوی ${formatNumber(index + 1)}`} className="space-y-5 rounded-2xl border bg-background/40 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor={`scenario-${index}`} className="shrink-0">سناریوی {formatNumber(index + 1)}</Label>
        <NativeSelect id={`scenario-${index}`} value={months} className="h-11 rounded-xl bg-background/60"
          onChange={(event) => onChange(Number(event.target.value))}>
          {allowedMonths.map((month) => <NativeSelectOption key={month} value={month} disabled={month === otherMonths}>{formatNumber(month)} ماه</NativeSelectOption>)}
        </NativeSelect>
      </div>
      <div><p className="text-xs text-muted-foreground">قسط ماهانه</p>
        <p className="mt-2 text-2xl font-semibold text-primary tabular-nums">{data ? formatNumber(data.monthlyPayment) : "—"} <span className="text-xs text-muted-foreground">تومان</span></p></div>
      {data ? <dl className="space-y-3 text-sm">
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">مجموع سود</dt><dd>{formatNumber(data.totalInterest)} تومان</dd></div>
        <div className="flex flex-wrap justify-between gap-2"><dt className="text-muted-foreground">کل پرداخت</dt><dd>{formatNumber(data.totalPayment)} تومان</dd></div>
      </dl> : <p className="text-xs text-muted-foreground">{result && !result.success ? result.error.message : "اطلاعات خرید را تکمیل کنید."}</p>}
      <Button type="button" variant={selected ? "secondary" : "outline"} className="h-11 w-full" disabled={!data || selected} onClick={onApply}>
        {selected ? "مدت فعلی" : "اعمال در محاسبه"}
      </Button>
    </article>
  );
}
