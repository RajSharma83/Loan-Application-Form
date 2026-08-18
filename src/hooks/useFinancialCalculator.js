import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

function toNumber(value) {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

export default function useFinancialCalculator() {
  const { watch } = useFormContext();

  const monthlyIncome = watch("monthlyIncome");
  const otherIncome = watch("otherIncome");
  const existingEMI = watch("existingEMI");
  const monthlyExpenses = watch("monthlyExpenses");

  const requestedLoanAmount = watch("requestedLoanAmount");
  const interestRate = watch("interestRate");
  const loanTenure = watch("loanTenure");

  return useMemo(() => {
    const income = toNumber(monthlyIncome);
    const extraIncome = toNumber(otherIncome);

    const emi = toNumber(existingEMI);
    const expenses = toNumber(monthlyExpenses);

    const loanAmount = toNumber(requestedLoanAmount);
    const rate = toNumber(interestRate);
    const tenure = toNumber(loanTenure);

    // -----------------------------------------
    // Total Income
    // -----------------------------------------

    const totalIncome = income + extraIncome;

    // -----------------------------------------
    // Disposable Income
    // -----------------------------------------

    const disposableIncome =
      totalIncome - emi - expenses;

    // -----------------------------------------
    // Maximum Total EMI
    // -----------------------------------------

    const maximumTotalEMI =
      totalIncome * 0.4;

    // -----------------------------------------
    // Maximum New EMI
    // -----------------------------------------

    const maximumNewEMI = Math.max(
      0,
      maximumTotalEMI - emi
    );

    // -----------------------------------------
    // Proposed EMI
    // -----------------------------------------

    const monthlyRate =
      rate / 12 / 100;

    const numberOfPayments =
      tenure * 12;

    let proposedEMI = 0;

    if (
      loanAmount > 0 &&
      monthlyRate > 0 &&
      numberOfPayments > 0
    ) {
      proposedEMI =
        (loanAmount *
          monthlyRate *
          Math.pow(
            1 + monthlyRate,
            numberOfPayments
          )) /
        (Math.pow(
          1 + monthlyRate,
          numberOfPayments
        ) - 1);
    }

    // -----------------------------------------
    // Maximum Eligible Loan
    // -----------------------------------------

    let maximumEligibleLoan = 0;

    if (
      maximumNewEMI > 0 &&
      monthlyRate > 0 &&
      numberOfPayments > 0
    ) {
      maximumEligibleLoan =
        (maximumNewEMI *
          (Math.pow(
            1 + monthlyRate,
            numberOfPayments
          ) - 1)) /
        (monthlyRate *
          Math.pow(
            1 + monthlyRate,
            numberOfPayments
          ));
    }

    // -----------------------------------------
    // Total EMI
    // -----------------------------------------

    const totalEMI =
      emi + proposedEMI;

    // -----------------------------------------
    // Total Cost of Borrowing & Processing Fee
    // (JD Section C3.3): Total Cost = (EMI × n) - P
    // Processing Fee = 1% of loan amount, min ₹2,000, max ₹25,000
    // -----------------------------------------

    const totalCostOfBorrowing =
      proposedEMI > 0 && numberOfPayments > 0
        ? proposedEMI * numberOfPayments - loanAmount
        : 0;

    const processingFee =
      loanAmount > 0
        ? Math.min(25000, Math.max(2000, loanAmount * 0.01))
        : 0;

    // -----------------------------------------
    // DTI
    // -----------------------------------------

    const dti =
      totalIncome === 0
        ? 0
        : (totalEMI / totalIncome) * 100;

    // -----------------------------------------
    // Eligibility
    // -----------------------------------------

    const eligible =
      dti <= 40 &&
      disposableIncome > 0 &&
      proposedEMI <= maximumNewEMI;

    return {
      totalIncome,
      disposableIncome,

      existingEMI: emi,
      proposedEMI,
      totalEMI,

      maximumTotalEMI,
      maximumNewEMI,
      maximumEligibleLoan,

      totalCostOfBorrowing,
      processingFee,

      dti,
      eligible,
    };
  }, [
    monthlyIncome,
    otherIncome,
    existingEMI,
    monthlyExpenses,
    requestedLoanAmount,
    interestRate,
    loanTenure,
  ]);
}