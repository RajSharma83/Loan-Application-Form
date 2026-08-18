import { z } from "zod";

const coApplicantSchema = z.object({
  coApplicantRelationship: z
    .string()
    .min(1, "Please select the co-applicant's relationship to you."),

  coApplicantFirstName: z
    .string()
    .min(2, "First name must be at least 2 characters.")
    .regex(/^[A-Za-z\s'-]+$/, "Only letters are allowed."),

  coApplicantLastName: z
    .string()
    .min(2, "Last name must be at least 2 characters.")
    .regex(/^[A-Za-z\s'-]+$/, "Only letters are allowed."),

  coApplicantDob: z
    .string()
    .min(1, "Co-applicant's date of birth is required.")
    .refine((value) => {
      const dob = new Date(value);
      if (Number.isNaN(dob.getTime())) return false;

      const age =
        (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

      return age >= 18 && age <= 75;
    }, "Co-applicant must be between 18 and 75 years old."),

  coApplicantMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number."),

  coApplicantEmail: z
    .string()
    .min(1, "Co-applicant email is required.")
    .email("Enter a valid email address."),

  // Same pattern used for the primary applicant's PAN (kyc.schema.js) —
  // kept identical so masking/format rules stay consistent app-wide.
  coApplicantPan: z
    .string()
    .min(10, "PAN is required")
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"),

  coApplicantMonthlyIncome: z
    .string()
    .min(1, "Co-applicant's monthly income is required.")
    .refine(
      (value) => Number(String(value).replace(/\D/g, "")) >= 5000,
      "Monthly income must be at least ₹5,000."
    ),

  coApplicantConsent: z.literal(true, {
    errorMap: () => ({
      message:
        "The co-applicant must consent to being included on this application.",
    }),
  }),
});

export default coApplicantSchema;
