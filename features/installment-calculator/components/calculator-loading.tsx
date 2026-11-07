import { Skeleton } from "@/components/ui/skeleton";

export function CalculatorLoading() {
  return (
    <div role="status" aria-label="در حال دریافت اطلاعات" className="grid items-start gap-5 md:grid-cols-[13rem_minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-6">
      <span className="sr-only">در حال دریافت اطلاعات خودرو و شرایط فروش…</span>
      <div className="grid grid-cols-3 gap-2 rounded-2xl border bg-card p-2 md:grid-cols-1 md:content-start md:gap-4 md:rounded-3xl md:p-5">
        {[0, 1, 2].map((index) => <Skeleton key={index} className="h-16 w-full md:h-12" />)}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        {[0, 1].map((index) => <div key={index} className="space-y-6 rounded-3xl border bg-card p-6 sm:p-8">
          <Skeleton className="h-6 w-32" /><Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" /><Skeleton className="h-24 w-full" />
        </div>)}
      </div>
    </div>
  );
}
