import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useForm, FormProvider as RHFFormProvider } from "react-hook-form";

import useFinancialCalculator from "../useFinancialCalculator";

function wrapperWithValues(values) {
  return function Wrapper({ children }) {
    const methods = useForm({ defaultValues: values });
    return <RHFFormProvider {...methods}>{children}</RHFFormProvider>;
  };
}

function standardEMI(principal, annualRatePct, years) {
  const monthlyRate = annualRatePct / 12 / 100;
  const n = years * 12;
  if (!principal || !monthlyRate || !n) return 0;
  return (
    (principal * monthlyRate * (1 + monthlyRate) ** n) /
    ((1 + monthlyRate) ** n - 1)
  );
}

describe("useFinancialCalculator", () => {
  it("matches the standard reducing-balance EMI formula", () => {
    const values = {
      monthlyIncome: "100000",
      otherIncome: "0",
      existingEMI: "0",
      monthlyExpenses: "20000",
      requestedLoanAmount: "1000000",
      interestRate: "10",
      loanTenure: "5",
    };

    const { result } = renderHook(() => useFinancialCalculator(), {
      wrapper: wrapperWithValues(values),
    });

    const expectedEmi = standardEMI(1000000, 10, 5);
    expect(result.current.proposedEMI).toBeCloseTo(expectedEmi, 2);
  });

  it("flags ineligible when the EMI/income ratio (DTI) exceeds 40%", () => {
    const values = {
      monthlyIncome: "30000",
      otherIncome: "0",
      existingEMI: "0",
      monthlyExpenses: "5000",
      requestedLoanAmount: "2000000",
      interestRate: "12",
      loanTenure: "3",
    };

    const { result } = renderHook(() => useFinancialCalculator(), {
      wrapper: wrapperWithValues(values),
    });

    expect(result.current.dti).toBeGreaterThan(40);
    expect(result.current.eligible).toBe(false);
  });

  it("flags eligible for a comfortably affordable loan", () => {
    const values = {
      monthlyIncome: "200000",
      otherIncome: "0",
      existingEMI: "0",
      monthlyExpenses: "10000",
      requestedLoanAmount: "500000",
      interestRate: "9",
      loanTenure: "5",
    };

    const { result } = renderHook(() => useFinancialCalculator(), {
      wrapper: wrapperWithValues(values),
    });

    expect(result.current.eligible).toBe(true);
  });

  it("existing EMI reduces the maximum new EMI headroom", () => {
    const base = {
      monthlyIncome: "100000",
      otherIncome: "0",
      monthlyExpenses: "0",
      requestedLoanAmount: "0",
      interestRate: "10",
      loanTenure: "5",
    };

    const { result: withoutExisting } = renderHook(
      () => useFinancialCalculator(),
      { wrapper: wrapperWithValues({ ...base, existingEMI: "0" }) }
    );

    const { result: withExisting } = renderHook(
      () => useFinancialCalculator(),
      { wrapper: wrapperWithValues({ ...base, existingEMI: "10000" }) }
    );

    expect(withExisting.current.maximumNewEMI).toBeLessThan(
      withoutExisting.current.maximumNewEMI
    );
  });
});
