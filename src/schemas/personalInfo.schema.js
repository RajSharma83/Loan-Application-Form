import { z } from "zod";

function calculateAge(dobString) {
  const dob = new Date(dobString);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDifference = today.getMonth() - dob.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < dob.getDate())
  ) {
    age -= 1;
  }

  return age;
}

const personalInfoSchema = z
  .object({
    firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .regex(
      /^[A-Za-z\s'-]+$/,
      "Only letters are allowed"
    ),

   lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .regex(
      /^[A-Za-z\s'-]+$/,
      "Only letters are allowed"
    ),

    email: z
      .string()
      .email("Enter a valid email"),

    countryCode: z.string().min(1),

    mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

    alternateMobile: z
      .string()
      .optional()
      .refine(
        (value) => !value || /^[6-9]\d{9}$/.test(value),
        "Enter a valid 10-digit mobile number"
      ),

    fatherName: z
      .string()
      .min(2, "Father's name must be at least 2 characters")
      .regex(/^[A-Za-z\s'-]+$/, "Only letters are allowed"),

    motherName: z
      .string()
      .min(2, "Mother's name must be at least 2 characters")
      .regex(/^[A-Za-z\s'-]+$/, "Only letters are allowed"),

    dob: z
      .string()
    .min(1, "Date of Birth is required")
    .refine((value) => {
      const dob = new Date(value);
      if (Number.isNaN(dob.getTime())) return false;
      return calculateAge(value) >= 21;
    }, {
      message: "Applicant must be at least 21 years old.",
    })
    .refine((value) => {
      const dob = new Date(value);
      if (Number.isNaN(dob.getTime())) return true; // let the above catch it
      return calculateAge(value) <= 65;
    }, {
      message: "Applicant must be 65 years old or younger.",
    }),

    gender: z
      .string()
      .min(1, "Select gender"),

    maritalStatus: z
      .string()
      .min(1, "Select marital status"),

    // Pass-through only: not owned by this step, but needed here so
    // the age+tenure cross-step check below can see it. Zod strips
    // any key not declared in the object shape before superRefine runs.
    loanTenure: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.alternateMobile &&
      data.mobile &&
      data.alternateMobile === data.mobile
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["alternateMobile"],
        message: "Alternate mobile number must be different from your primary mobile number.",
      });
    }

    const age = calculateAge(data.dob);
    const tenureMonths = Number(data.loanTenure);

    if (
      Number.isFinite(age) &&
      Number.isFinite(tenureMonths) &&
      tenureMonths > 0
    ) {
      const tenureYears = tenureMonths / 12;

      if (age + tenureYears > 65) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dob"],
          message: `Your age plus loan tenure exceeds 65 years (currently ${age} + ${tenureYears.toFixed(
            1
          )} years). Please reduce the loan tenure in Step 1 or contact support.`,
        });
      }
    }
  });

export default personalInfoSchema;