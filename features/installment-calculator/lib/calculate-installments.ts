import { calculatorInputSchema } from "../schemas/calculator-schema";
import type {
  CalculationResult,
  CalculatorInput,
  InstallmentRow,
} from "../types/calculator-types";

const unsafeAmount: CalculationResult = {
  success: false,
  error: {
    code: "UNSAFE_AMOUNT",
    message: "مبلغ محاسبه‌شده خارج از محدوده امن عددی است.",
  },
};

/** Calculates a fixed-payment loan with interest rounded on the outstanding balance. */
export function calculateInstallments(input: CalculatorInput): CalculationResult {
  const parsed = calculatorInputSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "قیمت، پیش‌پرداخت، نرخ سود و تعداد ماه را بررسی کنید.",
      },
    };
  }

  const { vehiclePrice, downPayment, annualInterestRate, months } = parsed.data;
  const loanAmount = vehiclePrice - downPayment;

  if (loanAmount === 0) {
    return {
      success: true,
      data: {
        loanAmount: 0,
        monthlyPayment: 0,
        finalPayment: 0,
        totalInstallments: 0,
        totalPayment: downPayment,
        totalInterest: 0,
        schedule: [],
      },
    };
  }

  const monthlyRate = annualInterestRate / 100 / 12;
  // log1p/expm1 avoid cancellation when a small positive rate approaches zero.
  const exactPayment = monthlyRate === 0
    ? loanAmount / months
    : loanAmount * (monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate)));
  const monthlyPayment = Math.round(exactPayment);

  if (!Number.isSafeInteger(monthlyPayment)) {
    return unsafeAmount;
  }

  let remainingBalance = loanAmount;
  let totalInstallments = 0;
  let totalInterest = 0;
  const schedule: InstallmentRow[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = Math.round(remainingBalance * monthlyRate);
    if (!Number.isSafeInteger(interest)) {
      return unsafeAmount;
    }

    // Cap early payments at the balance; reconcile all remaining principal in the last row.
    const principal = month === months
      ? remainingBalance
      : Math.min(remainingBalance, Math.max(0, monthlyPayment - interest));
    const payment = principal + interest;
    remainingBalance -= principal;
    totalInstallments += payment;
    totalInterest += interest;

    if (!Number.isSafeInteger(payment) || !Number.isSafeInteger(totalInstallments) ||
      !Number.isSafeInteger(totalInterest) || !Number.isSafeInteger(downPayment + totalInstallments)) {
      return unsafeAmount;
    }

    schedule.push({ month, payment, principal, interest, remainingBalance });
  }

  return {
    success: true,
    data: {
      loanAmount,
      monthlyPayment,
      finalPayment: schedule[schedule.length - 1].payment,
      totalInstallments,
      totalPayment: downPayment + totalInstallments,
      totalInterest,
      schedule,
    },
  };
}
