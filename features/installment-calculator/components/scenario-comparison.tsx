import { GitCompareArrows } from "lucide-react";
import { formatNumber } from "@/lib/format";
import type { CalculationResult } from "../model/calculator-types";
import { ScenarioCard } from "./scenario-card";

interface ScenarioComparisonProps {
  scenarios: readonly { months: number; result: CalculationResult | null }[];
  allowedMonths: readonly number[];
  currentMonths: number | null;
  onChange: (index: number, months: number) => void;
  onApply: (months: number) => void;
}

export function ScenarioComparison({ scenarios, allowedMonths, currentMonths, onChange, onApply }: ScenarioComparisonProps) {
  if (allowedMonths.length < 2) return <p className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">برای مقایسه، حداقل دو مدت بازپرداخت لازم است.</p>;
  const first = scenarios[0].result;
  const second = scenarios[1].result;
  const interestDifference = first?.success && second?.success
    ? Math.abs(first.data.totalInterest - second.data.totalInterest) : null;

  return (
    <section aria-labelledby="comparison-title" className="rounded-3xl border bg-card p-6 sm:p-8">
      <h2 id="comparison-title" className="mb-6 flex items-center gap-2 text-lg font-semibold">
        <GitCompareArrows size={20} className="text-primary" aria-hidden="true" />مقایسه دو سناریو
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {scenarios.map((scenario, index) => <ScenarioCard key={index} index={index} {...scenario}
          allowedMonths={allowedMonths} otherMonths={scenarios[1 - index].months}
          selected={currentMonths === scenario.months}
          onChange={(months) => onChange(index, months)} onApply={() => onApply(scenario.months)} />)}
      </div>
      {interestDifference !== null && <p className="mt-5 text-sm text-muted-foreground">اختلاف سود دو سناریو: <span className="text-foreground">{formatNumber(interestDifference)} تومان</span></p>}
    </section>
  );
}
