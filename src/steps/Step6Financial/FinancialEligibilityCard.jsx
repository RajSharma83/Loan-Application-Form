import useFinancialCalculator from "../../hooks/useFinancialCalculator";

function formatCurrency(value) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function FinancialEligibilityCard() {
  const {
    eligible,
    dti,
    disposableIncome,
    existingEMI,
    proposedEMI,
    totalEMI,
    riskLevel,
  } = useFinancialCalculator();

  const status = eligible
    ? {
        title: "Eligible",
        message:
          "Your requested loan appears to be within the estimated affordability limit.",
        bg: "bg-emerald-50",
        border: "border-emerald-300",
        text: "text-emerald-700",
      }
    : {
        title: "Not Eligible",
        message:
          "The requested loan may create a higher debt burden than your estimated affordability limit.",
        bg: "bg-red-50",
        border: "border-red-300",
        text: "text-red-700",
      };

  const riskStyles = {
    Low: "text-emerald-700",
    Medium: "text-amber-600",
    High: "text-red-600",
  };

  return (
    <div
      className={`neu-surface rounded-2xl border p-6 ${status.bg} ${status.border}`}
    >
      <div className="flex items-start justify-between gap-6">
        <div>
          <h3
            className={`text-lg font-semibold ${status.text}`}
          >
            {status.title}
          </h3>

          <p className="mt-2 text-sm text-slate-600">
            {status.message}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Risk Level
          </p>

          <p
            className={`mt-1 text-xl font-bold ${
              riskStyles[riskLevel]
            }`}
          >
            {riskLevel}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* DTI */}
        <div className="neu-inset-shadow rounded-xl bg-white/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            DTI Ratio
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {dti.toFixed(2)}%
          </p>
        </div>

        {/* Existing EMI */}
        <div className="neu-inset-shadow rounded-xl bg-white/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Existing EMI
          </p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {formatCurrency(existingEMI)}
          </p>
        </div>

        {/* Proposed EMI */}
        <div className="neu-inset-shadow rounded-xl bg-white/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Proposed EMI
          </p>

          <p className="mt-1 text-xl font-bold text-indigo-600">
            {formatCurrency(proposedEMI)}
          </p>
        </div>

        {/* Disposable Income */}
        <div className="neu-inset-shadow rounded-xl bg-white/70 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Disposable Income
          </p>

          <p className="mt-1 text-xl font-bold text-emerald-700">
            {formatCurrency(disposableIncome)}
          </p>
        </div>
      </div>

      {/* Total EMI */}
      <div className="neu-inset-shadow mt-4 rounded-xl border border-white/80 bg-white/60 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Total Monthly EMI Burden
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(totalEMI)}
          </span>
        </div>
      </div>

      {/* Risk explanation */}
      <div className="mt-4">
        <p className="text-xs text-slate-500">
          DTI includes both your existing EMI and the
          estimated EMI for the requested loan.
        </p>
      </div>
    </div>
  );
}

export default FinancialEligibilityCard;