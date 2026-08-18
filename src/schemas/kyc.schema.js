import { z } from "zod";

import { verhoeffValidate } from "../utils/verhoeff";

const kycSchema = z
  .object({
    pan: z
      .string()
      .min(10, "PAN is required")
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN format"
      ),

    aadhaar: z
      .string()
      .min(12, "Aadhaar is required")
      .regex(
        /^[0-9]{12}$/,
        "Aadhaar must contain exactly 12 digits"
      )
      .refine(
        (aadhaar) => verhoeffValidate(aadhaar),
        "Invalid Aadhaar number (checksum verification failed)"
      ),

    voterId: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[A-Z]{3}[0-9]{7}$/.test(value),
        "Voter ID must be 3 letters followed by 7 digits (e.g. ABC1234567)"
      ),

    passport: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[A-Z]{1}[0-9]{7}$/.test(value),
        "Passport number must be 1 letter followed by 7 digits (e.g. A1234567)"
      ),

    // Pass-through only: not owned by this step, but needed here so
    // the PAN entity-type rule below can see it — Zod strips any key
    // not declared in the object shape before superRefine runs.
    loanType: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pan?.length !== 10) return;

    const entityChar = data.pan[3];

    // PAN 4th character indicates entity type: P for Individual,
    // C for Company, F for Firm, etc. Only individual PANs are valid
    // for personal/home loans; business loans also accept Company or
    // Firm PANs, per the JD (Section C3.1).
    const allowedEntityChars =
      data.loanType === "business" ? ["P", "C", "F"] : ["P"];

    if (!allowedEntityChars.includes(entityChar)) {
      const description =
        data.loanType === "business"
          ? "PAN 4th character must indicate entity type (P for Individual, C for Company, or F for Firm)."
          : "PAN 4th character must indicate entity type (P for Individual).";

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pan"],
        message: description,
      });
    }
  });

export default kycSchema;