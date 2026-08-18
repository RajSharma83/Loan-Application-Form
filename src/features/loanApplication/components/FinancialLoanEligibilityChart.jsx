import { useFormContext } from "react-hook-form";
import useFinancialCalculator from "../../../hooks/useFinancialCalculator";

function toNumber(value) {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function FinancialLoanEligibilityChart() {
  const { watch } = useFormContext();

  const requestedLoanAmount = toNumber(
    watch("requestedLoanAmount")
  );

  const {
    maximumEligibleLoan = 0,
  } = useFinancialCalculator();

  const maximumLoan = toNumber(maximumEligibleLoan);

  const chartMaximum = Math.max(
    requestedLoanAmount,
    maximumLoan,
    1
  );

  const requestedWidth = Math.min(
    100,
    (requestedLoanAmount / chartMaximum) * 100
  );

  const eligibleWidth = Math.min(
    100,
    (maximumLoan / chartMaximum) * 100
  );

  const isWithinLimit =
    requestedLoanAmount <= maximumLoan;

  const difference = Math.abs(
    maximumLoan - requestedLoanAmount
  );

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Requested Loan vs Maximum Eligible Loan
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Compare the requested loan amount with your
          estimated maximum eligible loan.
        </p>
      </div>

      {/* Values */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Requested Loan
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {formatCurrency(requestedLoanAmount)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Maximum Eligible Loan
          </p>

          <p className="mt-2 text-2xl font-bold text-emerald-600">
            {formatCurrency(maximumLoan)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 space-y-6">
        {/* Requested Loan */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Requested Loan
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(requestedLoanAmount)}
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${requestedWidth}%`,
              }}
            />
          </div>
        </div>

        {/* Maximum Eligible Loan */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Maximum Eligible Loan
            </span>

            <span className="text-sm font-semibold text-emerald-600">
              {formatCurrency(maximumLoan)}
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${eligibleWidth}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Status */}
      <div
        className={`mt-6 rounded-xl border p-4 ${
          isWithinLimit
            ? "border-emerald-200 bg-emerald-50"
            : "border-red-200 bg-red-50"
        }`}
      >
        <p
          className={`font-semibold ${
            isWithinLimit
              ? "text-emerald-700"
              : "text-red-700"
          }`}
        >
          {isWithinLimit
            ? "Requested amount is within your estimated eligibility"
            : "Requested amount exceeds your estimated eligibility"}
        </p>

        <p className="mt-1 text-sm text-slate-600">
          {requestedLoanAmount === 0
            ? "Enter a requested loan amount to compare your eligibility."
            : isWithinLimit
            ? `${formatCurrency(
                difference
              )} remains within your estimated eligible amount.`
            : `${formatCurrency(
                difference
              )} exceeds your estimated eligible amount.`}
        </p>
      </div>
    </section>
  );
}

export default FinancialLoanEligibilityChart;