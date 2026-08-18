import { describe, it, expect } from "vitest";

import { getVisibleSteps, getNextVisibleStepId, getPreviousVisibleStepId } from "../visibleSteps";

describe("Co-Applicant step visibility (boundary conditions)", () => {
  it("does NOT show Step 6 when the amount equals the threshold exactly", () => {
    const visible = getVisibleSteps({ loanType: "personal", loanAmount: "500000" });
    expect(visible.some((s) => s.id === 6)).toBe(false);
  });

  it("DOES show Step 6 when the amount is one rupee over the threshold", () => {
    const visible = getVisibleSteps({ loanType: "personal", loanAmount: "500001" });
    expect(visible.some((s) => s.id === 6)).toBe(true);
  });

  it("does NOT show Step 6 when the amount is below the threshold", () => {
    const visible = getVisibleSteps({ loanType: "personal", loanAmount: "100000" });
    expect(visible.some((s) => s.id === 6)).toBe(false);
  });

  it("handles formatted amounts with commas/currency symbols", () => {
    const atBoundary = getVisibleSteps({ loanType: "personal", loanAmount: "₹5,00,000" });
    const overBoundary = getVisibleSteps({ loanType: "personal", loanAmount: "₹5,00,001" });

    expect(atBoundary.some((s) => s.id === 6)).toBe(false);
    expect(overBoundary.some((s) => s.id === 6)).toBe(true);
  });

  it("applies the home loan threshold, not the personal loan one", () => {
    // 600000 exceeds personal's threshold but not home's.
    const home = getVisibleSteps({ loanType: "home", loanAmount: "600000" });
    const personal = getVisibleSteps({ loanType: "personal", loanAmount: "600000" });

    expect(home.some((s) => s.id === 6)).toBe(false);
    expect(personal.some((s) => s.id === 6)).toBe(true);
  });

  it("does not show Step 6 for an unknown/unset loan type regardless of amount", () => {
    const visible = getVisibleSteps({ loanType: undefined, loanAmount: "99999999" });
    expect(visible.some((s) => s.id === 6)).toBe(false);
  });

  it("does not blow up on missing formData", () => {
    expect(() => getVisibleSteps(undefined)).not.toThrow();
    expect(getVisibleSteps(undefined).some((s) => s.id === 6)).toBe(false);
  });
});

describe("Wizard navigation skips hidden steps", () => {
  const lowAmountData = { loanType: "personal", loanAmount: "100000" };
  const highAmountData = { loanType: "personal", loanAmount: "600000" };

  it("nextStep from Employment(5) goes to Financial(7) when Co-Applicant is hidden", () => {
    expect(getNextVisibleStepId(5, lowAmountData)).toBe(7);
  });

  it("nextStep from Employment(5) goes to Co-Applicant(6) when it's required", () => {
    expect(getNextVisibleStepId(5, highAmountData)).toBe(6);
  });

  it("previousStep from Financial(7) goes back to Employment(5) when Co-Applicant is hidden", () => {
    expect(getPreviousVisibleStepId(7, lowAmountData)).toBe(5);
  });

  it("previousStep from Financial(7) goes back to Co-Applicant(6) when it's required", () => {
    expect(getPreviousVisibleStepId(7, highAmountData)).toBe(6);
  });

  it("changing the amount mid-flow changes what the next step resolves to", () => {
    // User was going to need a co-applicant, then lowered the amount.
    expect(getNextVisibleStepId(5, highAmountData)).toBe(6);
    expect(getNextVisibleStepId(5, lowAmountData)).toBe(7);
  });

  it("does not move past the last step", () => {
    expect(getNextVisibleStepId(9, lowAmountData)).toBe(9);
  });

  it("does not move before the first step", () => {
    expect(getPreviousVisibleStepId(1, lowAmountData)).toBe(1);
  });
});
