import { FileText } from "lucide-react";

import useFinancialCalculator from "../../hooks/useFinancialCalculator";

function formatINR(amount) {
  if (!Number.isFinite(amount)) return "₹0";
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function KeyFactStatementRow({ label, value, emphasis = false }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span
        className={
          emphasis
            ? "text-base font-bold text-indigo-700"
            : "text-sm font-semibold text-slate-900"
        }
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Key Fact Statement (KFS) — RBI Digital Lending Guidelines (Sept
 * 2022) require borrowers see a comprehensive summary of amount,
 * tenure, interest rate, EMI, total cost of borrowing, and all fees
 * before final submission. This is that summary.
 */
function KeyFactStatement({ loanAmount, loanTenure, interestRate }) {
  const {
    proposedEMI,
    totalCostOfBorrowing,
    processingFee,
  } = useFinancialCalculator();

  return (
    <div className="neu-surface rounded-2xl bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <FileText size={20} className="text-indigo-600" />
        <h3 className="text-lg font-semibold text-slate-900">
          Key Fact Statement
        </h3>
      </div>

      <p className="mb-4 text-sm text-slate-500">
        A summary of the key terms of this loan, as required by RBI's
        Digital Lending Guidelines, so you can review the complete
        cost of borrowing before you submit.
      </p>

      <div>
        <KeyFactStatementRow
          label="Loan Amount"
          value={formatINR(Number(String(loanAmount || 0).replace(/\D/g, "")))}
        />
        <KeyFactStatementRow
          label="Tenure"
          value={`${loanTenure || 0} months`}
        />
        <KeyFactStatementRow
          label="Interest Rate (Fixed)"
          value={`${interestRate || 0}% p.a.`}
        />
        <KeyFactStatementRow
          label="Estimated Monthly EMI"
          value={formatINR(proposedEMI)}
          emphasis
        />
        <KeyFactStatementRow
          label="Total Cost of Borrowing"
          value={formatINR(totalCostOfBorrowing)}
        />
        <KeyFactStatementRow
          label="Processing Fee"
          value={formatINR(processingFee)}
        />
      </div>
    </div>
  );
}

export default KeyFactStatement;
