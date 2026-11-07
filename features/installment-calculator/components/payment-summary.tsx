import { ArrowUpLeft, Wallet } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { CalculationResult } from "../model/calculator-types";
import type { SharedCalculation } from "../model/shared-calculation-types";
import { PrincipalInterestChart } from "./principal-interest-chart";
import { ShareCalculationButton } from "./share-calculation-button";

interface PaymentSummaryProps {
  result: CalculationResult | null;
  vehicleName: string;
  months: number | null;
  shareCalculation: SharedCalculation | null;
}

function SummaryRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">
        {formatNumber(amount)} <span className="text-xs font-normal text-muted-foreground">تومان</span>
      </dd>
    </div>
  );
}

export function PaymentSummary({ result, vehicleName, months, shareCalculation }: PaymentSummaryProps) {
  const data = result?.success ? result.data : null;
  return (
    <section aria-labelledby="summary-title" className="overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-xl shadow-black/10 lg:sticky lg:top-8">
      <div className="border-b border-primary/10 bg-linear-to-bl from-primary/10 to-transparent p-6 sm:p-8">
        <div className="mb-8 flex items-center justify-between gap-3">
          <h2 id="summary-title" className="flex items-center gap-2 text-sm font-medium text-primary">
            <Wallet size={18} aria-hidden="true" />خلاصه پرداخت
          </h2>
          <ArrowUpLeft size={20} className="text-primary/50" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">قسط ماهانه</p>
        <p className="my-4 flex flex-wrap items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight text-primary tabular-nums sm:text-5xl" data-testid="monthly-payment">
            {data ? formatNumber(data.monthlyPayment) : "—"}
          </span>
          <span className="text-sm text-muted-foreground">تومان</span>
        </p>
        <p className="text-sm text-muted-foreground">{data ? `${vehicleName} · ${formatNumber(months ?? 0)} ماه` : "در انتظار اطلاعات خرید"}</p>
      </div>
      <div className="px-6 py-3 sm:px-8">
        {data ? <>
          <dl className="divide-y">
            <SummaryRow label="مبلغ وام" amount={data.loanAmount} />
            <SummaryRow label="مجموع سود" amount={data.totalInterest} />
            <SummaryRow label="کل پرداخت با پیش‌پرداخت" amount={data.totalPayment} />
          </dl>
          {data.loanAmount === 0 && <p className="border-t py-4 text-sm text-primary">تسویه کامل</p>}
          <PrincipalInterestChart calculation={data} />
        </> : <p role="status" className="py-5 text-sm text-muted-foreground">
          {result && !result.success ? result.error.message : "اطلاعات خرید را تکمیل کنید."}
        </p>}
        <ShareCalculationButton calculation={shareCalculation} />
      </div>
    </section>
  );
}
