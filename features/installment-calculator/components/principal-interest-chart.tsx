import { formatNumber } from "@/lib/format";
import type { InstallmentCalculation } from "../types/calculator-types";

export function PrincipalInterestChart({ calculation }: { calculation: InstallmentCalculation }) {
  const { loanAmount, totalInterest, totalInstallments } = calculation;
  if (totalInstallments === 0) return null;
  const principalPercent = loanAmount / totalInstallments * 100;
  const interestPercent = 100 - principalPercent;

  return (
    <figure aria-label="سهم اصل و سود از مجموع اقساط" className="border-t py-5">
      <figcaption className="mb-4 text-xs text-muted-foreground">ترکیب اقساط · بدون پیش‌پرداخت</figcaption>
      <div role="img" aria-label={`اصل وام ${formatNumber(principalPercent)} درصد، سود ${formatNumber(interestPercent)} درصد`}
        className="flex h-3 overflow-hidden rounded-full" dir="ltr">
        <span className="bg-primary" style={{ width: `${principalPercent}%` }} />
        <span className="bg-sky-400" style={{ width: `${interestPercent}%` }} />
      </div>
      <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">
        <div><dt className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-primary" />اصل وام</dt>
          <dd className="mt-2 tabular-nums">{formatNumber(loanAmount)} تومان</dd></div>
        <div><dt className="flex items-center gap-2 text-muted-foreground"><span className="size-2 rounded-full bg-sky-400" />سود</dt>
          <dd className="mt-2 tabular-nums">{formatNumber(totalInterest)} تومان</dd></div>
      </dl>
    </figure>
  );
}
