import { z } from "zod";

const addressSchema = z
  .object({
    country: z.string().min(1, "Country is required"),

    state: z.string().min(1, "State is required"),

    city: z.string().min(1, "City is required"),

    pinCode: z
      .string()
      .regex(/^[1-9][0-9]{5}$/, "Invalid PIN Code"),

    address1: z.string().min(5, "Address is required"),

    address2: z.string().optional(),

    residentialStatus: z.string().min(
      1,
      "Select residential status"
    ),

    yearsAtAddress: z.coerce
      .number()
      .min(0, "Invalid value"),

    previousCountry: z.string().optional(),

    previousState: z.string().optional(),

    previousCity: z.string().optional(),

    previousPinCode: z.string().optional(),

    previousAddress1: z.string().optional(),

    previousAddress2: z.string().optional(),

    permanentSameAsCurrent: z.boolean().optional(),

    permanentCountry: z.string().optional(),

    permanentState: z.string().optional(),

    permanentCity: z.string().optional(),

    permanentPinCode: z.string().optional(),

    permanentAddress1: z.string().optional(),

    permanentAddress2: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.permanentSameAsCurrent) {
      if (!data.permanentCountry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["permanentCountry"],
          message: "Country is required",
        });
      }

      if (!data.permanentState) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["permanentState"],
          message: "State is required",
        });
      }

      if (!data.permanentCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["permanentCity"],
          message: "City is required",
        });
      }

      if (
        !data.permanentPinCode ||
        !/^[1-9][0-9]{5}$/.test(data.permanentPinCode)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["permanentPinCode"],
          message: "Valid PIN Code is required",
        });
      }

      if (
        !data.permanentAddress1 ||
        data.permanentAddress1.length < 5
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["permanentAddress1"],
          message: "Permanent Address is required",
        });
      }
    }

    if (data.yearsAtAddress < 1) {
      if (!data.previousCountry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["previousCountry"],
          message: "Country is required",
        });
      }

      if (!data.previousState) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["previousState"],
          message: "State is required",
        });
      }

      if (!data.previousCity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["previousCity"],
          message: "City is required",
        });
      }

      if (
        !data.previousPinCode ||
        !/^[1-9][0-9]{5}$/.test(data.previousPinCode)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["previousPinCode"],
          message: "Valid PIN Code is required",
        });
      }

      if (
        !data.previousAddress1 ||
        data.previousAddress1.length < 5
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["previousAddress1"],
          message: "Previous Address is required",
        });
      }
    }
  });

export default addressSchema;