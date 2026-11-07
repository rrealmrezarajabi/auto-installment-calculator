import { formatNumber } from "@/lib/format";
import type { InstallmentCalculation } from "../types/calculator-types";

export function InstallmentTableTotals({ calculation }: { calculation: InstallmentCalculation }) {
  return (
    <tfoot className="border-t-2 bg-secondary font-semibold">
      <tr>
        <th scope="row" className="px-5 py-4 text-start">جمع کل</th>
        <td className="px-5 py-4 text-end">{formatNumber(calculation.totalInstallments)}</td>
        <td className="px-5 py-4 text-end">{formatNumber(calculation.loanAmount)}</td>
        <td className="px-5 py-4 text-end">{formatNumber(calculation.totalInterest)}</td>
        <td className="px-5 py-4 text-end">{formatNumber(calculation.schedule.at(-1)?.remainingBalance ?? 0)}</td>
      </tr>
    </tfoot>
  );
}
