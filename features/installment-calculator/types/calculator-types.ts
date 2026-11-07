import type { z } from "zod";
import type { calculatorInputSchema } from "../schemas/calculator-schema";

/** Monetary values are whole tomans; interest rate is an annual percentage. */
export type CalculatorInput = z.infer<typeof calculatorInputSchema>;

export interface InstallmentRow {
  readonly month: number;
  readonly payment: number;
  readonly principal: number;
  readonly interest: number;
  readonly remainingBalance: number;
}

export interface InstallmentCalculation {
  readonly loanAmount: number;
  /** Rounded regular installment. The final installment may differ. */
  readonly monthlyPayment: number;
  readonly finalPayment: number;
  /** Sum of scheduled payments, excluding the down payment. */
  readonly totalInstallments: number;
  /** Down payment plus scheduled payments. */
  readonly totalPayment: number;
  readonly totalInterest: number;
  readonly schedule: readonly InstallmentRow[];
}

export type CalculationResult =
  | { readonly success: true; readonly data: InstallmentCalculation }
  | {
      readonly success: false;
      readonly error: {
        readonly code: "INVALID_INPUT" | "UNSAFE_AMOUNT";
        readonly message: string;
      };
    };
