import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

function toNumber(value) {
  const cleaned = String(value ?? "").replace(/,/g, "").replace(/[^\d.]/g, "");
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function FinancialEmiAffordabilityChart() {
  const { watch } = useFormContext();

  const monthlyIncome = watch("monthlyIncome");
  const otherIncome = watch("otherIncome");
  const existingEMI = watch("existingEMI");
  const monthlyExpenses = watch("monthlyExpenses");

  const requestedLoanAmount = watch("requestedLoanAmount");
  const interestRate = watch("interestRate");
  const loanTenure = watch("loanTenure");

  const calculations = useMemo(() => {
    const income = toNumber(monthlyIncome);
    const extraIncome = toNumber(otherIncome);
    const existingEmi = toNumber(existingEMI);
    const expenses = toNumber(monthlyExpenses);

    const loanAmount = toNumber(requestedLoanAmount);
    const rate = toNumber(interestRate);
    const years = toNumber(loanTenure);

    const totalIncome = income + extraIncome;

    /*
     * Maximum total EMI allowed = 40% of total income.
     */
    const maximumTotalEMI = totalIncome * 0.4;

    /*
     * Existing EMI and committed monthly expenses
     * both consume part of the allowed EMI capacity.
     */
    const maximumAffordableEMI = Math.max(
      0,
      maximumTotalEMI - existingEmi - expenses
    );

    /*
     * Calculate proposed EMI for requested loan.
     */
    const monthlyRate = rate / 12 / 100;
    const numberOfPayments = years * 12;

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

    const maximumChartValue = Math.max(
      maximumAffordableEMI,
      proposedEMI,
      existingEmi,
      1
    );

    return {
      existingEmi,
      maximumAffordableEMI,
      proposedEMI,
      maximumChartValue,
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

  const getWidth = (value) => {
    return Math.min(
      100,
      (value / calculations.maximumChartValue) * 100
    );
  };

  const proposedWithinLimit =
    calculations.proposedEMI <=
    calculations.maximumAffordableEMI;

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          EMI Affordability
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Compare your existing EMI and proposed EMI with
          your estimated affordable EMI limit.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        {/* Maximum Affordable EMI */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Maximum Affordable EMI
            </span>

            <span className="text-sm font-semibold text-emerald-600">
              {formatCurrency(
                calculations.maximumAffordableEMI
              )}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-300"
              style={{
                width: `${getWidth(
                  calculations.maximumAffordableEMI
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Existing EMI */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Existing EMI
            </span>

            <span className="text-sm font-semibold text-slate-700">
              {formatCurrency(
                calculations.existingEmi
              )}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-slate-500 transition-all duration-300"
              style={{
                width: `${getWidth(
                  calculations.existingEmi
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Proposed EMI */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Proposed EMI
            </span>

            <span
              className={`text-sm font-semibold ${
                proposedWithinLimit
                  ? "text-indigo-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(
                calculations.proposedEMI
              )}
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                proposedWithinLimit
                  ? "bg-indigo-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${getWidth(
                  calculations.proposedEMI
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`mt-6 rounded-xl border p-4 ${
          proposedWithinLimit
            ? "border-emerald-200 bg-emerald-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <p
          className={`font-semibold ${
            proposedWithinLimit
              ? "text-emerald-700"
              : "text-red-700"
          }`}
        >
          {proposedWithinLimit
            ? "Proposed EMI is affordable"
            : "Proposed EMI exceeds affordability"}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          {proposedWithinLimit
            ? `You have approximately ${formatCurrency(
                calculations.maximumAffordableEMI -
                  calculations.proposedEMI
              )} of additional EMI capacity.`
            : `The proposed EMI is ${formatCurrency(
                calculations.proposedEMI -
                  calculations.maximumAffordableEMI
              )} above your estimated affordable limit.`}
        </p>
      </div>
    </section>
  );
}

export default FinancialEmiAffordabilityChart;