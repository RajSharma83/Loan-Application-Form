import { z } from "zod";

const PDF_ONLY = ["application/pdf"];
const IMAGE_AND_PDF = ["image/jpeg", "image/png", "application/pdf"];
const IMAGE_ONLY = ["image/jpeg", "image/png"];

function makeFileSchema(maxSizeMB, acceptedTypes) {
  const maxBytes = maxSizeMB * 1024 * 1024;
  const formatsLabel = acceptedTypes
    .map((t) => (t === "application/pdf" ? "PDF" : t.split("/")[1].toUpperCase()))
    .join(", ");

  return z
    .instanceof(File, { message: "Please upload a file" })
    .refine((file) => file.size <= maxBytes, `Maximum file size is ${maxSizeMB}MB`)
    .refine(
      (file) => acceptedTypes.includes(file.type),
      `Only ${formatsLabel} files are allowed`
    );
}

const documentsSchema = z
  .object({
    // Conditionally required — see superRefine below: optional once
    // PAN was verified in Step 3 (cross-step dependency, Section B3).
    panDocument: makeFileSchema(5, IMAGE_AND_PDF).optional(),

    aadhaarFrontDocument: makeFileSchema(5, IMAGE_AND_PDF),
    aadhaarBackDocument: makeFileSchema(5, IMAGE_AND_PDF),

    bankStatement: makeFileSchema(10, PDF_ONLY),

    photograph: makeFileSchema(2, IMAGE_ONLY),

    // Conditionally required — see superRefine below. Salaried
    // applicants need a salary slip; self-employed applicants need an
    // ITR document instead (per "Employment Type → documents").
    salarySlip: makeFileSchema(5, PDF_ONLY).optional(),
    itrDocument: makeFileSchema(5, PDF_ONLY).optional(),

    // Conditionally required by loan type — see superRefine below.
    propertyDocument: makeFileSchema(10, PDF_ONLY).optional(),
    businessRegistrationDocument: makeFileSchema(5, PDF_ONLY).optional(),
    gstReturnsDocument: makeFileSchema(5, PDF_ONLY).optional(),

    // Pass-through only: not owned by this step, but needed here so
    // the conditional checks below can see them — Zod strips any key
    // not declared in the object shape before superRefine ever runs.
    loanType: z.string().optional(),
    employmentType: z.string().optional(),
    panVerified: z.boolean().optional(),

    signature: z
      .string()
      .min(1, "Please provide your signature before continuing.")
      .refine(
        (value) => value.startsWith("data:image/png"),
        "Please provide your signature before continuing."
      ),
  })
  .superRefine((data, ctx) => {
    if (!data.panVerified && !data.panDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["panDocument"],
        message: "Please upload a copy of your PAN card (or verify it in the KYC step).",
      });
    }

    if (data.employmentType === "salaried" && !data.salarySlip) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["salarySlip"],
        message: "Please upload your latest salary slips.",
      });
    }

    if (
      (data.employmentType === "selfEmployed" ||
        data.employmentType === "businessOwner") &&
      !data.itrDocument
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["itrDocument"],
        message: "Please upload your ITR for the last 2 years.",
      });
    }

    if (data.loanType === "home" && !data.propertyDocument) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["propertyDocument"],
        message: "Please upload your property documents.",
      });
    }

    if (data.loanType === "business") {
      if (!data.businessRegistrationDocument) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessRegistrationDocument"],
          message: "Please upload your business registration certificate.",
        });
      }

      if (!data.gstReturnsDocument) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gstReturnsDocument"],
          message: "Please upload your GST returns for the last 4 quarters.",
        });
      }
    }
  });

export default documentsSchema;
