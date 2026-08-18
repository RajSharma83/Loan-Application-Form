import { test, expect } from "@playwright/test";

/**
 * These specs require a running dev server (`npm run dev`) and were
 * NOT executable in the sandbox that produced them (no network / no
 * working Vite build here — see the accompanying report). Review and
 * run locally with `npm run test:e2e` before relying on them.
 */

async function selectLoanType(page, label) {
  await page.getByText(label, { exact: false }).click();
}

async function fillLoanBasics(page, { loanType, amount, tenure }) {
  await selectLoanType(page, loanType);
  await page.getByLabel(/Loan Amount/i).fill(amount);
  await page.getByLabel(/Loan Tenure/i).fill(tenure);
  await page.getByRole("button", { name: /continue/i }).click();
}

test.describe("Conditional Co-Applicant step (Step 6)", () => {
  test("does NOT appear when the amount equals the threshold exactly (₹5,00,000)", async ({
    page,
  }) => {
    await page.goto("/");

    await fillLoanBasics(page, {
      loanType: "Personal Loan",
      amount: "500000",
      tenure: "36",
    });

    // Step indicator should never show a "Co-Applicant" pill for this
    // session once we know the amount is at (not over) the threshold.
    await expect(page.getByText("Co-Applicant")).toHaveCount(0);
  });

  test("DOES appear when the amount is ₹1 over the threshold", async ({
    page,
  }) => {
    await page.goto("/");

    await fillLoanBasics(page, {
      loanType: "Personal Loan",
      amount: "500001",
      tenure: "36",
    });

    await expect(page.getByText("Co-Applicant").first()).toBeVisible();
  });

  test("disappears again if the user goes back and lowers the amount", async ({
    page,
  }) => {
    await page.goto("/");

    await fillLoanBasics(page, {
      loanType: "Personal Loan",
      amount: "600000",
      tenure: "36",
    });

    // Now on Step 2 (Personal Info) — the step indicator should list a
    // Co-Applicant pill somewhere in the sequence.
    await expect(
      page.locator('[data-testid="step-pill"]', { hasText: "Co-Applicant" })
    ).toHaveCount(1);

    // Go back to Step 1 and lower the amount below the threshold.
    await page.getByRole("button", { name: /go back/i }).click();
    await page.getByTestId("loan-amount-input").fill("400000");

    // The Co-Applicant pill must be gone immediately — this is the
    // "obsolete Step 6 data must be handled safely" / live-reactivity
    // requirement, not just correct on first render.
    await expect(
      page.locator('[data-testid="step-pill"]', { hasText: "Co-Applicant" })
    ).toHaveCount(0);
  });
});
