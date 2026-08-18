/**
 * Live currency display formatting for amount inputs. The stored form
 * value is always raw digits (e.g. "54543"); the DISPLAYED value is
 * Indian-locale comma-formatted (e.g. "54,543"). Extracted here since
 * this exact logic had been duplicated ad-hoc in three different
 * files (MonthlyIncomeField, LoanAffordabilityCalculator,
 * DynamicFieldRenderer) with several other amount fields — Loan
 * Amount, Co-Applicant Income — missing it entirely.
 */

export function formatCurrencyDisplay(value) {
  if (!value) return "";

  const numericValue = String(value).replace(/\D/g, "");

  if (!numericValue) return "";

  return new Intl.NumberFormat("en-IN").format(Number(numericValue));
}

/**
 * Strips a formatted display value back down to raw digits — this is
 * what actually gets stored in the form.
 */
export function parseCurrencyInput(displayValue) {
  return String(displayValue ?? "").replace(/\D/g, "");
}
