export interface FinancingOptions {
  /** Annual percentage, e.g. 24 means 24%, not 0.24. */
  readonly annualInterestRate: number;
  readonly allowedMonths: readonly number[];
  /** IRT denotes toman throughout this application. */
  readonly currency: "IRT";
}

export type FinancingOptionsResponse = FinancingOptions;
