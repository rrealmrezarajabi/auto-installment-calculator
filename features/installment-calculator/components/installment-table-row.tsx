import { formatNumber } from "@/lib/format";
import type { InstallmentRow } from "../types/calculator-types";

interface InstallmentTableRowProps {
  installment: InstallmentRow;
  isLast: boolean;
}

export function InstallmentTableRow({ installment, isLast }: InstallmentTableRowProps) {
  const { month, payment, principal, interest, remainingBalance } = installment;

  return (
    <tr className={isLast ? "bg-secondary/60" : "odd:bg-muted/35 hover:bg-muted/60"}>
      <th scope="row" className="px-5 py-4 text-start font-medium">
        {formatNumber(month)}
        {isLast && <span className="ms-2 text-xs text-primary">آخر</span>}
      </th>
      <td className="px-5 py-4 text-end font-semibold">{formatNumber(payment)}</td>
      <td className="px-5 py-4 text-end">{formatNumber(principal)}</td>
      <td className="px-5 py-4 text-end text-muted-foreground">{formatNumber(interest)}</td>
      <td className="px-5 py-4 text-end">{formatNumber(remainingBalance)}</td>
    </tr>
  );
}
