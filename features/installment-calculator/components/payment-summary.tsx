import { CircleCheck, Info, Wallet } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { CalculationResult } from "../model/calculator-types";

interface PaymentSummaryProps {
  result: CalculationResult | null;
  vehicleName: string;
  months: number | null;
}

function SummaryRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-semibold tabular-nums">{formatNumber(amount)} <span className="text-xs font-normal text-muted-foreground">تومان</span></dd>
    </div>
  );
}

export function PaymentSummary({ result, vehicleName, months }: PaymentSummaryProps) {
  const data = result?.success ? result.data : null;
  return (
    <section aria-labelledby="summary-title" className="overflow-hidden rounded-2xl border bg-white shadow-sm lg:sticky lg:top-8">
      <div className="bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="mb-6 flex items-center gap-2 text-sm text-white/80"><Wallet size={18} aria-hidden="true" /><h2 id="summary-title">خلاصه محاسبات</h2></div>
        <p className="text-sm text-white/80">قسط ماهانه</p>
        <p className="my-3 flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl" data-testid="monthly-payment">{data ? formatNumber(data.monthlyPayment) : "—"}</span>
          <span className="text-sm text-white/80">تومان</span>
        </p>
        <p className="min-h-5 text-xs text-white/75">{data ? `${vehicleName} · ${formatNumber(months ?? 0)} ماه` : "با تکمیل ورودی‌ها، نتیجه اینجا نمایش داده می‌شود."}</p>
      </div>
      <div className="p-6 sm:p-8">
        {data ? <>
          <dl className="divide-y">
            <SummaryRow label="مبلغ وام" amount={data.loanAmount} />
            <SummaryRow label="مجموع سود" amount={data.totalInterest} />
            <SummaryRow label="مجموع پرداختی با پیش‌پرداخت" amount={data.totalPayment} />
          </dl>
          <div className="mt-5 flex items-start gap-2 rounded-xl bg-secondary p-4 text-xs leading-6 text-secondary-foreground">
            <CircleCheck size={17} className="mt-1 shrink-0" aria-hidden="true" />
            <p>{data.loanAmount === 0 ? "با این پیش‌پرداخت، مبلغ خودرو کامل تسویه می‌شود و قسطی ندارید."
              : data.finalPayment !== data.monthlyPayment
                ? `قسط آخر ${formatNumber(data.finalPayment)} تومان است تا مانده وام دقیقاً تسویه شود.`
                : "مبلغ‌ها به تومان گرد شده‌اند و مانده وام در پایان صفر می‌شود."}</p>
          </div>
        </> : <div className="flex items-start gap-3 py-5 text-sm leading-7 text-muted-foreground" role="status">
          <Info size={20} className="mt-1 shrink-0" aria-hidden="true" />
          <p>{result && !result.success ? result.error.message : "اطلاعات فرم را کامل و خطاهای ورودی را اصلاح کنید تا نتیجه محاسبه شود."}</p>
        </div>}
        <p className="mt-5 text-xs leading-6 text-muted-foreground">قیمت‌ها و شرایط فروش نمونه‌اند. مجموع پرداختی شامل پیش‌پرداخت و همه اقساط است.</p>
      </div>
    </section>
  );
}
