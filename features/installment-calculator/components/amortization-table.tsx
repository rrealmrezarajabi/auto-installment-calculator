import { ListOrdered } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { CalculationResult } from "../types/calculator-types";
import { InstallmentTableRow } from "./installment-table-row";
import { InstallmentTableTotals } from "./installment-table-totals";

export function AmortizationTable({ result }: { result: CalculationResult | null }) {
  const calculation = result?.success ? result.data : null;
  const hasRows = calculation !== null && calculation.schedule.length > 0;

  return (
    <section aria-labelledby="amortization-title" className="min-w-0 overflow-hidden rounded-3xl border bg-card shadow-xl shadow-black/10">
      <div className="space-y-2 border-b p-6 sm:p-8">
        <h2 id="amortization-title" className="flex items-center gap-2 text-lg font-semibold">
          <ListOrdered size={20} className="text-primary" aria-hidden="true" />
          جدول اقساط
        </h2>
        <p className="text-xs leading-6 text-muted-foreground">تومان · بدون پیش‌پرداخت</p>
      </div>
      {hasRows ? <>
        <p id="amortization-scroll-hint" className="sr-only">
          برای دیدن همه ستون‌ها روی صفحه‌های کوچک، جدول را به چپ و راست بکشید.
        </p>
        <div role="region" aria-label="ناحیه پیمایش جدول اقساط" aria-describedby="amortization-scroll-hint"
          tabIndex={0} className="max-h-[32rem] overflow-auto overscroll-x-contain focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring">
          <table className="w-full min-w-[42rem] border-collapse whitespace-nowrap text-sm tabular-nums">
            <caption className="sr-only">ریز اقساط ماهانه؛ مبالغ به تومان و بدون پیش‌پرداخت</caption>
            <thead className="sticky top-0 z-10 bg-muted text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-4 text-start font-medium">ماه</th>
                {['مبلغ قسط', 'اصل وام', 'سود', 'مانده وام'].map((label) => (
                  <th key={label} scope="col" className="px-5 py-4 text-end font-medium">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {calculation.schedule.map((installment, index) => (
                <InstallmentTableRow key={installment.month} installment={installment}
                  isLast={index === calculation.schedule.length - 1} />
              ))}
            </tbody>
            <InstallmentTableTotals calculation={calculation} />
          </table>
        </div>
        {calculation.finalPayment !== calculation.monthlyPayment && (
          <p className="border-t px-6 py-4 text-xs leading-6 text-primary sm:px-8">
            قسط آخر: {formatNumber(calculation.finalPayment)} تومان · تعدیل بابت گردکردن
          </p>
        )}
      </> : <p className="p-6 text-sm leading-7 text-muted-foreground sm:p-8">
        {calculation?.loanAmount === 0
          ? "تسویه کامل؛ بدون اقساط"
          : "اطلاعات خرید را تکمیل کنید."}
      </p>}
    </section>
  );
}
