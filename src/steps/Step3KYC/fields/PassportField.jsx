import { useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function PassportField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const loanAmount = Number(
    String(watch("loanAmount") ?? "").replace(/\D/g, "")
  );

  // Per JD Section B2, Step 3: Passport is only relevant/shown when
  // the applicant is taking a Home Loan over ₹50,00,000.
  const isVisible = loanType === "home" && loanAmount > 5000000;

  if (!isVisible) return null;

  return (
    <Input
      label="Passport Number (Optional)"
      placeholder="A1234567"
      maxLength={8}
      className="uppercase"
      error={errors.passport?.message}
      {...register("passport", {
        onChange: (e) => {
          e.target.value = e.target.value.toUpperCase();
        },
      })}
    />
  );
}

export default PassportField;
