import { Calculator, GitCompareArrows, ListOrdered, PanelsTopLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalculatorView } from "../model/calculator-view-types";

export const calculatorViews = [
  { id: "calculator", label: "محاسبه", icon: Calculator },
  { id: "comparison", label: "مقایسه سناریوها", icon: GitCompareArrows },
  { id: "schedule", label: "جدول اقساط", icon: ListOrdered },
] as const;

interface CalculatorNavigationProps {
  view: CalculatorView;
  onSelect: (view: CalculatorView) => void;
}

export function CalculatorNavigation({ view, onSelect }: CalculatorNavigationProps) {
  return (
    <aside className="self-start rounded-2xl border bg-card/70 p-2 md:sticky md:top-6 md:rounded-3xl md:p-4">
      <div className="mb-5 hidden items-center gap-2 border-b px-2 pb-5 pt-2 text-sm font-semibold md:flex">
        <PanelsTopLeft size={18} className="text-primary" aria-hidden="true" />پنل محاسبات
      </div>
      <nav aria-label="بخش‌های ماشین‌حساب" className="grid grid-cols-3 gap-1 md:grid-cols-1 md:gap-2">
        {calculatorViews.map(({ id, label, icon: Icon }) => (
          <button key={id} id={`nav-${id}`} type="button" aria-pressed={view === id}
            aria-controls={`panel-${id}`} onClick={() => onSelect(id)}
            className={cn(
              "flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl px-2 py-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:min-h-12 md:flex-row md:justify-start md:px-3 md:text-sm",
              view === id ? "bg-primary/12 text-primary ring-1 ring-primary/15" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}>
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
