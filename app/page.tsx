import { Calculator, CarFront, ShieldCheck } from "lucide-react";
import { InstallmentCalculator } from "@/features/installment-calculator/components/installment-calculator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-white"><CarFront size={23} aria-hidden="true" /></span>
            <div><p className="text-base font-bold">همراه خودرو</p><p className="mt-1 text-xs text-muted-foreground">خرید آگاهانه، پرداخت آسوده</p></div>
          </div>
          <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><ShieldCheck size={16} aria-hidden="true" />محاسبه شفاف اقساط</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 flex items-center gap-2 text-xs font-medium text-primary"><Calculator size={15} aria-hidden="true" />برنامه‌ریزی خرید خودرو</p>
          <h1 className="text-2xl font-bold leading-relaxed sm:text-3xl">قسط خودروی شما چقدر می‌شود؟</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">پیش‌پرداخت و مدت بازپرداخت را تغییر دهید و مبلغ قسط و هزینه نهایی خرید را همان لحظه ببینید.</p>
        </div>
        <InstallmentCalculator />
        <footer className="mt-8 text-center text-xs leading-6 text-muted-foreground">همه مبلغ‌ها به تومان هستند · قیمت خودروها و شرایط فروش، نمونه و ساختگی‌اند.</footer>
      </main>
    </div>
  );
}
