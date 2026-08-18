import useFinancialCalculator from "../../../hooks/useFinancialCalculator";

function formatCurrency(value) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function FinancialDtiChart() {
  const {
    dti,
    totalIncome,
    existingEMI,
    proposedEMI,
  } = useFinancialCalculator();

  const safeDTI = Math.max(0, dti || 0);

  /*
   * The visual gauge goes from 0% to 60%.
   * Anything above 60% is displayed at the end of the gauge.
   */
  const gaugePercentage = Math.min(
    (safeDTI / 60) * 100,
    100
  );

  let riskLevel = "Low";
  let riskMessage =
    "Your debt burden is currently within a healthy range.";

  let progressColor = "bg-emerald-500";
  let riskColor = "text-emerald-600";
  let riskBackground = "bg-emerald-50";
  let riskBorder = "border-emerald-200";

  if (safeDTI > 40) {
    riskLevel = "High";

    riskMessage =
      "Your debt burden is above the recommended level and may affect loan approval.";

    progressColor = "bg-red-500";
    riskColor = "text-red-600";
    riskBackground = "bg-red-50";
    riskBorder = "border-red-200";
  } else if (safeDTI > 30) {
    riskLevel = "Medium";

    riskMessage =
      "Your debt burden is moderate. A higher DTI may reduce your borrowing capacity.";

    progressColor = "bg-amber-500";
    riskColor = "text-amber-600";
    riskBackground = "bg-amber-50";
    riskBorder = "border-amber-200";
  }

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Debt-to-Income Ratio
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Your DTI shows how much of your monthly income
          is committed to EMI payments.
        </p>
      </div>

      {/* Main DTI value */}
      <div className="mt-6 flex items-end justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Current DTI
          </p>

          <p className="mt-1 text-4xl font-bold text-slate-900">
            {safeDTI.toFixed(2)}%
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-semibold ${riskBackground} ${riskColor}`}
        >
          {riskLevel} Risk
        </div>
      </div>

      {/* Gauge */}
      <div className="mt-8">
        <div className="relative">
          {/* Gauge background */}
          <div className="h-6 overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
              style={{
                width: `${gaugePercentage}%`,
              }}
            />
          </div>

          {/* 40% marker */}
          <div
            className="absolute top-[-8px] h-10 border-l-2 border-slate-500"
            style={{
              left: "66.6667%",
            }}
          />
        </div>

        {/* Gauge labels */}
        <div className="relative mt-3 h-6 text-xs text-slate-400">
          <span className="absolute left-0">
            0%
          </span>

          <span
            className="absolute -translate-x-1/2"
            style={{
              left: "50%",
            }}
          >
            30%
          </span>

          <span
            className="absolute -translate-x-1/2 font-medium text-slate-600"
            style={{
              left: "66.6667%",
            }}
          >
            40%
          </span>

          <span className="absolute right-0">
            60%+
          </span>
        </div>
      </div>

      {/* Risk message */}
      <div
        className={`mt-6 rounded-xl border p-4 ${riskBackground} ${riskBorder}`}
      >
        <p className={`font-semibold ${riskColor}`}>
          {riskLevel} DTI Risk
        </p>

        <p className="mt-1 text-sm text-slate-600">
          {riskMessage}
        </p>
      </div>

      {/* Financial breakdown */}
      <div className="mt-6 rounded-xl bg-slate-50 p-4">
        <h4 className="text-sm font-semibold text-slate-800">
          DTI Breakdown
        </h4>

        <div className="mt-4 space-y-3">
          {/* Income */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Total Monthly Income
            </span>

            <span className="font-semibold text-slate-900">
              {formatCurrency(totalIncome)}
            </span>
          </div>

          {/* Existing EMI */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Existing EMI
            </span>

            <span className="font-semibold text-slate-900">
              {formatCurrency(existingEMI)}
            </span>
          </div>

          {/* Proposed EMI */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Proposed EMI
            </span>

            <span className="font-semibold text-indigo-600">
              {formatCurrency(proposedEMI)}
            </span>
          </div>

          {/* Total EMI */}
          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Total EMI
              </span>

              <span className="font-bold text-slate-900">
                {formatCurrency(
                  (existingEMI || 0) +
                    (proposedEMI || 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formula explanation */}
      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          DTI Formula
        </p>

        <p className="mt-2 text-sm text-slate-700">
          Total EMI ÷ Total Monthly Income × 100
        </p>
      </div>
    </section>
  );
}

export default FinancialDtiChart;