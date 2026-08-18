import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Input from "../../components/ui/Input";

function formatCurrency(value) {
  if (!value) return "";

  const numericValue = String(value).replace(/\D/g, "");

  if (!numericValue) return "";

  return new Intl.NumberFormat("en-IN").format(
    Number(numericValue)
  );
}

function MonthlyIncomeField() {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const employmentType = watch("employmentType");
  const annualIncome = watch("annualIncome");
  const pensionAmount = watch("pensionAmount");

  /*
   * Step 5 → Step 6 income handoff
   *
   * Salaried:
   * monthlyIncome already exists.
   *
   * Self Employed:
   * annualIncome / 12
   *
   * Retired:
   * pensionAmount
   *
   * Student:
   * user enters monthly income manually.
   */

  useEffect(() => {
    if (employmentType === "salaried") {
      return;
    }

    if (employmentType === "selfEmployed") {
      const annual = Number(
        String(annualIncome || "").replace(/\D/g, "")
      );

      if (annual > 0) {
        setValue(
          "monthlyIncome",
          String(Math.round(annual / 12)),
          {
            shouldValidate: true,
            shouldDirty: false,
          }
        );
      }

      return;
    }

    if (employmentType === "retired") {
      const pension = String(
        pensionAmount || ""
      ).replace(/\D/g, "");

      if (pension) {
        setValue("monthlyIncome", pension, {
          shouldValidate: true,
          shouldDirty: false,
        });
      }
    }
  }, [
    employmentType,
    annualIncome,
    pensionAmount,
    setValue,
  ]);

  const isAutomaticallyCalculated =
    employmentType === "salaried" ||
    employmentType === "selfEmployed" ||
    employmentType === "retired";

  return (
    <Controller
      name="monthlyIncome"
      control={control}
      defaultValue=""
      render={({ field }) => {
        const handleChange = (event) => {
          const numericValue =
            event.target.value.replace(/\D/g, "");

          field.onChange(numericValue);
        };

        return (
          <Input
            name={field.name}
            ref={field.ref}
            value={formatCurrency(field.value)}
            onChange={handleChange}
            onBlur={field.onBlur}
            type="text"
            inputMode="numeric"
            label="Monthly Income"
            placeholder="Enter monthly income"
            required
            readOnly={isAutomaticallyCalculated}
            error={errors.monthlyIncome?.message}
          />
        );
      }}
    />
  );
}

export default MonthlyIncomeField;