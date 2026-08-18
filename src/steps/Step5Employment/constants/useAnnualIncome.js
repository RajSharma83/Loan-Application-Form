import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

function useAnnualIncome() {
  const { watch, setValue } = useFormContext();

  const monthlyIncome = watch("monthlyIncome");

  useEffect(() => {
    const monthly = Number(
      String(monthlyIncome || "").replace(/\D/g, "")
    );

    if (!monthly) {
      setValue("annualIncome", "");
      return;
    }

    const annual = monthly * 12;

    setValue("annualIncome", String(annual), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [monthlyIncome, setValue]);

  return {
    annualIncome: watch("annualIncome"),
  };
}

export default useAnnualIncome;