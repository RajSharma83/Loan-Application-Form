import { z } from "zod";

const financialSchema = z.object({
  monthlyIncome: z
    .string()
    .min(1, "Monthly income is required"),

  existingEMI: z
    .string()
    .min(1, "Existing EMI is required"),

  otherIncome: z
    .string()
    .optional(),

  monthlyExpenses: z
    .string()
    .min(1, "Monthly expenses are required"),

      requestedLoanAmount: z
      .string()
      .min(1, "Loan amount is required"),

     interestRate: z
     .string()
     .min(1, "Interest rate is required"),

     loanTenure: z
     .string()
     .min(1, "Loan tenure is required"),
   });

export default financialSchema;