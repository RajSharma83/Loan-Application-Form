/**
 * Fixed interest rates by loan type, per JD Section C3.3:
 *   "The interest rate is determined by: Personal Loan: 10.5% p.a.
 *    (fixed for simulation); Home Loan: 8.5% p.a.; Business Loan: 14% p.a."
 *
 * Single source of truth — read this everywhere a rate is displayed
 * or used in a calculation, rather than hardcoding the number in more
 * than one place (that previously caused the Step 1 cards and the
 * EMI calculator to silently disagree with each other).
 */
const INTEREST_RATES = {
  personal: 10.5,
  home: 8.5,
  business: 14,
};

export function getInterestRate(loanType) {
  return INTEREST_RATES[loanType] ?? null;
}

export default INTEREST_RATES;
