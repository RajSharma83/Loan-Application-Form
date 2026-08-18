import useFinancialCalculator from "../../hooks/useFinancialCalculator";

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function FinancialSummary() {
  const {
    totalIncome,
    disposableIncome,
    dti,
  } = useFinancialCalculator();

  return (
    <div className="neu-surface rounded-2xl bg-white p-6">
      <h3 className="text-lg font-semibold text-slate-900">
        Financial Summary
      </h3>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">
            Total Monthly Income
          </span>

          <span className="font-semibold">
            {formatCurrency(totalIncome)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">
            Disposable Income
          </span>

          <span
            className={`font-semibold ${
              disposableIncome >= 0
                ? "text-emerald-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(disposableIncome)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">
            Debt-to-Income Ratio
          </span>

          <span className="font-semibold">
            {dti.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default FinancialSummary;