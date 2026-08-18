import { useMemo } from "react";
import { useFormContext } from "react-hook-form";

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

function FinancialIncomeExpenseChart() {
  const { watch } = useFormContext();

  const monthlyIncome = watch("monthlyIncome");
  const otherIncome = watch("otherIncome");
  const existingEMI = watch("existingEMI");
  const monthlyExpenses = watch("monthlyExpenses");

  const calculations = useMemo(() => {
    const income = toNumber(monthlyIncome);
    const other = toNumber(otherIncome);
    const emi = toNumber(existingEMI);
    const expenses = toNumber(monthlyExpenses);

    const totalIncome = income + other;

    const totalOutflow = emi + expenses;

    const disposableIncome = Math.max(
      0,
      totalIncome - totalOutflow
    );

    const maximumValue = Math.max(
      totalIncome,
      expenses,
      emi,
      disposableIncome,
      1
    );

    return {
      income,
      other,
      emi,
      expenses,
      totalIncome,
      totalOutflow,
      disposableIncome,
      maximumValue,
    };
  }, [
    monthlyIncome,
    otherIncome,
    existingEMI,
    monthlyExpenses,
  ]);

  const getBarWidth = (value) => {
    return `${Math.min(
      100,
      (value / calculations.maximumValue) * 100
    )}%`;
  };

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900">
          Income vs Expenses
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Overview of your monthly income, expenses, EMI
          obligations, and disposable income.
        </p>
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Total Income
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(
              calculations.totalIncome
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Monthly Expenses
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(
              calculations.expenses
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Existing EMI
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(
              calculations.emi
            )}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Disposable Income
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-600">
            {formatCurrency(
              calculations.disposableIncome
            )}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-8 space-y-6">
        {/* Total Income */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Total Monthly Income
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(
                calculations.totalIncome
              )}
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: getBarWidth(
                  calculations.totalIncome
                ),
              }}
            />
          </div>
        </div>

        {/* Monthly Expenses */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Monthly Expenses
            </span>

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(
                calculations.expenses
              )}
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-orange-400 transition-all duration-500"
              style={{
                width: getBarWidth(
                  calculations.expenses
                ),
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

            <span className="text-sm font-semibold text-slate-900">
              {formatCurrency(
                calculations.emi
              )}
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-red-400 transition-all duration-500"
              style={{
                width: getBarWidth(
                  calculations.emi
                ),
              }}
            />
          </div>
        </div>

        {/* Disposable Income */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Disposable Income
            </span>

            <span className="text-sm font-semibold text-emerald-600">
              {formatCurrency(
                calculations.disposableIncome
              )}
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{
                width: getBarWidth(
                  calculations.disposableIncome
                ),
              }}
            />
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Total monthly outflow
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(
              calculations.totalOutflow
            )}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Disposable income
          </span>

          <span className="font-semibold text-emerald-600">
            {formatCurrency(
              calculations.disposableIncome
            )}
          </span>
        </div>
      </div>
    </section>
  );
}

export default FinancialIncomeExpenseChart;