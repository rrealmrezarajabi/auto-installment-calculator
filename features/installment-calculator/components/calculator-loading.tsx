import { Skeleton } from "@/components/ui/skeleton";

export function CalculatorLoading() {
  return (
    <div role="status" aria-label="در حال دریافت اطلاعات" className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <span className="sr-only">در حال دریافت اطلاعات خودرو و شرایط فروش…</span>
      {[0, 1].map((index) => <div key={index} className="space-y-6 rounded-2xl border bg-white p-8">
        <Skeleton className="h-6 w-32" /><Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" /><Skeleton className="h-24 w-full" />
      </div>)}
    </div>
  );
}
