/**
 * Loan amount and tenure limits by loan type, per JD Section B2, Step 1:
 *   Loan Amount: Required; Min 50,000; Max varies by type
 *     Personal: max 10L; Home: max 1Cr; Business: max 50L
 *   Loan Tenure: Required; Range depends on loan type
 *     Personal: 12–60m; Home: 60–360m; Business: 12–120m
 */
const LOAN_LIMITS = {
  personal: {
    minAmount: 50000,
    maxAmount: 1000000,
    minTenure: 12,
    maxTenure: 60,
  },
  home: {
    minAmount: 50000,
    maxAmount: 10000000,
    minTenure: 60,
    maxTenure: 360,
  },
  business: {
    minAmount: 50000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 120,
  },
};

export function getLoanLimits(loanType) {
  return LOAN_LIMITS[loanType] ?? null;
}

export default LOAN_LIMITS;
