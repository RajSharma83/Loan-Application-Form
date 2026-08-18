import { z } from "zod";

import { getLoanLimits } from "../constants/loanLimits";

function formatINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

const loanTypeSchema = z
  .object({
    loanType: z
      .string()
      .min(1, "Please select a loan type"),

    loanAmount: z
      .string()
      .min(1, "Loan amount is required"),

    loanTenure: z
      .string()
      .min(1, "Loan tenure is required"),

    loanPurpose: z
      .string()
      .min(1, "Please select a purpose for this loan"),

    referralCode: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[A-Za-z0-9]{6,10}$/.test(value),
        "Referral code must be 6–10 alphanumeric characters"
      ),

    // Home Loan-specific fields (rendered dynamically via
    // ConditionalSection/DynamicFieldRenderer) — optional at the base
    // level, enforced conditionally below so they don't block other
    // loan types.
    propertyValue: z.string().optional(),
    downPayment: z.string().optional(),
    propertyType: z.string().optional(),
    propertyAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.loanType === "home") {
      if (!data.propertyValue || Number(data.propertyValue.replace(/\D/g, "")) < 100000) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["propertyValue"],
          message: "Property value is required (minimum ₹1,00,000).",
        });
      }

      if (data.downPayment === undefined || data.downPayment === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["downPayment"],
          message: "Down payment is required.",
        });
      }

      if (!data.propertyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["propertyType"],
          message: "Please select a property type.",
        });
      }

      if (!data.propertyAddress || data.propertyAddress.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["propertyAddress"],
          message: "Property address is required.",
        });
      }
    }
    const limits = getLoanLimits(data.loanType);
    if (!limits) return;

    const amount = Number(String(data.loanAmount).replace(/\D/g, ""));

    if (data.loanAmount && Number.isFinite(amount)) {
      if (amount < limits.minAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["loanAmount"],
          message: `Minimum loan amount is ${formatINR(limits.minAmount)}.`,
        });
      } else if (amount > limits.maxAmount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["loanAmount"],
          message: `Maximum loan amount for this loan type is ${formatINR(
            limits.maxAmount
          )}.`,
        });
      }
    }

    const tenure = Number(data.loanTenure);

    if (data.loanTenure && Number.isFinite(tenure)) {
      if (tenure < limits.minTenure || tenure > limits.maxTenure) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["loanTenure"],
          message: `Loan tenure for this loan type must be between ${limits.minTenure} and ${limits.maxTenure} months.`,
        });
      }
    }
  });

export default loanTypeSchema;