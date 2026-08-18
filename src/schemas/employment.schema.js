import { z } from "zod";

const employmentSchema = z
  .object({
    // =========================================================
    // EMPLOYMENT TYPE
    // =========================================================

    employmentType: z
      .string()
      .min(1, "Please select your employment type"),

    // Pass-through only: not owned by this step, but needed here so
    // the loan-type cross-check below can see it — Zod strips any key
    // not declared in the object shape before superRefine runs.
    loanType: z.string().optional(),

    // =========================================================
    // SALARIED
    // =========================================================

    companyName: z.string().optional(),

    industry: z.string().optional(),

    jobTitle: z.string().optional(),

    monthlyIncome: z.string().optional(),

    salaryBank: z.string().optional(),

    experienceYears: z.string().optional(),

    experienceMonths: z.string().optional(),

    // =========================================================
    // OFFICE ADDRESS
    // =========================================================

    officeCountry: z.string().optional(),

    officeState: z.string().optional(),

    officeCity: z.string().optional(),

    officePinCode: z.string().optional(),

    officeAddress1: z.string().optional(),

    officeAddress2: z.string().optional(),

    // =========================================================
    // SELF EMPLOYED
    // =========================================================

    businessName: z.string().optional(),

    businessType: z.string().optional(),

    annualIncome: z.string().optional(),

    yearsInBusiness: z.string().optional(),

    gstNumber: z.string().optional(),

    businessRegistrationNumber: z.string().optional(),

    // =========================================================
    // BUSINESS ADDRESS
    // =========================================================

    businessCountry: z.string().optional(),

    businessState: z.string().optional(),

    businessCity: z.string().optional(),

    businessPinCode: z.string().optional(),

    businessAddress1: z.string().optional(),

    businessAddress2: z.string().optional(),

    // =========================================================
    // STUDENT
    // =========================================================

    collegeName: z.string().optional(),

    course: z.string().optional(),

    graduationYear: z.string().optional(),

    // =========================================================
    // RETIRED
    // =========================================================
     retirementSector: z.string().optional(),

     retirementCompanyName: z.string().optional(),
     retirementIndustry: z.string().optional(),
     pensionAmount: z.string().optional(),
    
  })

  // =========================================================
  // CONDITIONAL VALIDATION
  // =========================================================

  .superRefine((data, ctx) => {
    // =======================================================
    // CROSS-STEP: Business Loan requires a business-owning
    // employment type (per JD Section B3 dependency map).
    // =======================================================

    if (
      data.loanType === "business" &&
      data.employmentType &&
      data.employmentType !== "selfEmployed" &&
      data.employmentType !== "businessOwner"
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["employmentType"],
        message:
          "A Business Loan requires Self Employed or Business Owner as the employment type.",
      });
    }

    // =======================================================
    // SALARIED
    // =======================================================

    if (data.employmentType === "salaried") {
      if (!data.companyName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required",
        });
      }

      if (!data.industry?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["industry"],
          message: "Industry is required",
        });
      }

      if (!data.jobTitle?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["jobTitle"],
          message: "Designation is required",
        });
      }

      if (!data.monthlyIncome?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["monthlyIncome"],
          message: "Monthly income is required",
        });
      }

      if (!data.salaryBank?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["salaryBank"],
          message: "Salary credit bank is required",
        });
      }

      if (!data.experienceYears?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["experienceYears"],
          message: "Experience years is required",
        });
      }

      if (!data.experienceMonths?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["experienceMonths"],
          message: "Experience months is required",
        });
      }

      // -----------------------------------------------------
      // OFFICE ADDRESS
      // -----------------------------------------------------

      if (!data.officeCountry?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["officeCountry"],
          message: "Country is required",
        });
      }

      if (!data.officeState?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["officeState"],
          message: "State is required",
        });
      }

      if (!data.officeCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["officeCity"],
          message: "City is required",
        });
      }

      if (!data.officePinCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["officePinCode"],
          message: "PIN Code is required",
        });
      } else if (!/^[1-9][0-9]{5}$/.test(data.officePinCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["officePinCode"],
          message: "Invalid PIN Code",
        });
      }

      if (!data.officeAddress1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["officeAddress1"],
          message: "Address is required",
        });
      }
    }

    // =======================================================
    // SELF EMPLOYED
    // =======================================================

    if (
      data.employmentType === "selfEmployed" ||
      data.employmentType === "businessOwner"
    ) {
      if (!data.businessName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessName"],
          message: "Business name is required",
        });
      }

      if (!data.businessType?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessType"],
          message: "Business type is required",
        });
      }

      if (!data.annualIncome?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["annualIncome"],
          message: "Annual income is required",
        });
      }

      if (!data.yearsInBusiness?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["yearsInBusiness"],
          message: "Years in business is required",
        });
      }

      // GST registration is legitimately optional for a self-employed
      // professional below the turnover threshold, but REQUIRED for a
      // registered Business Owner — only validate format when the
      // applicant provides one (self-employed), but require it
      // outright for businessOwner.
      if (data.employmentType === "businessOwner" && !data.gstNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gstNumber"],
          message: "GST Number is required for a registered business.",
        });
      } else if (
        data.gstNumber?.trim() &&
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          data.gstNumber.trim()
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gstNumber"],
          message: "Enter a valid 15-character GST number, or leave blank",
        });
      }

      if (
        data.employmentType === "businessOwner" &&
        !data.businessRegistrationNumber?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessRegistrationNumber"],
          message: "Business registration number is required.",
        });
      }

      // -----------------------------------------------------
      // BUSINESS ADDRESS
      // -----------------------------------------------------

      if (!data.businessCountry?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessCountry"],
          message: "Country is required",
        });
      }

      if (!data.businessState?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessState"],
          message: "State is required",
        });
      }

      if (!data.businessCity?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessCity"],
          message: "City is required",
        });
      }

      if (!data.businessPinCode?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessPinCode"],
          message: "PIN Code is required",
        });
      } else if (!/^[1-9][0-9]{5}$/.test(data.businessPinCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessPinCode"],
          message: "Invalid PIN Code",
        });
      }

      if (!data.businessAddress1?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["businessAddress1"],
          message: "Address is required",
        });
      }
    }

    // =======================================================
    // STUDENT
    // =======================================================

    if (data.employmentType === "student") {
      if (!data.collegeName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["collegeName"],
          message: "College name is required",
        });
      }

      if (!data.course?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["course"],
          message: "Course is required",
        });
      }

      if (!data.graduationYear?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["graduationYear"],
          message: "Graduation year is required",
        });
      }
    }

    // =======================================================
    // RETIRED
    // =======================================================

    if (data.employmentType === "retired") {
  if (!data.retirementSector?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["retirementSector"],
      message: "Employment sector is required",
    });
  }

  if (!data.retirementCompanyName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["retirementCompanyName"],
      message: "Company / organization name is required",
    });
  }

  if (!data.retirementIndustry?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["retirementIndustry"],
      message: "Industry is required",
    });
  }

  if (!data.pensionAmount?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["pensionAmount"],
      message: "Pension amount is required",
    });
  }
}
  });

export default employmentSchema;