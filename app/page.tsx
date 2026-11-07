import { CarFront } from "lucide-react";
import { InstallmentCalculator } from "@/features/installment-calculator/components/installment-calculator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5 bg-card/50">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary"><CarFront size={23} aria-hidden="true" /></span>
            <p className="text-base font-bold">همراه خودرو</p>
          </div>
          <span className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground">محاسبه اقساط</span>
        </div>
      </header>
      <main className="mx-auto max-w-[90rem] px-4 py-6 sm:px-8 sm:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold leading-relaxed tracking-tight sm:text-3xl">ماشین‌حساب <span className="text-primary">اقساط خودرو</span></h1>
        </div>
        <InstallmentCalculator />
        <footer className="mt-8 text-center text-xs text-muted-foreground">قیمت‌ها و شرایط فروش نمونه‌اند.</footer>
      </main>
    </div>
  );
}
