import { test, expect } from "@playwright/test";

/**
 * NOT executed in the sandbox that produced them (no working dev
 * server here — see the accompanying report). Run locally with
 * `npm run test:e2e` before relying on them.
 */

test.describe("Step 1 — Loan Type validation", () => {
  test("shows specific errors when continuing with nothing filled in", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: /continue/i }).click();

    await expect(
      page.getByText("Please select a loan type")
    ).toBeVisible();
    await expect(
      page.getByText("Loan amount is required")
    ).toBeVisible();
    await expect(
      page.getByText("Loan tenure is required")
    ).toBeVisible();

    // Must not have advanced past Step 1.
    await expect(page.getByLabel(/Loan Amount/i)).toBeVisible();
  });
});

test.describe("Rapid Next-click protection", () => {
  test("clicking Continue rapidly does not skip a step", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByText("Personal Loan", { exact: false }).click();
    await page.getByLabel(/Loan Amount/i).fill("300000");
    await page.getByLabel(/Loan Tenure/i).fill("24");

    const continueButton = page.getByRole("button", { name: /continue/i });

    // Fire multiple rapid clicks — with the isProcessing guard, only
    // the first should actually run; the button should immediately
    // reflect a disabled/busy state.
    await Promise.all([
      continueButton.click(),
      continueButton.click({ force: true }),
      continueButton.click({ force: true }),
    ]);

    // Should land on exactly Step 2 (Personal Information), not have
    // been fast-forwarded to Step 3 or beyond by overlapping calls.
    await expect(page.getByText("Personal Information")).toBeVisible();
    await expect(page.getByText("KYC Verification")).toHaveCount(0);
  });
});
