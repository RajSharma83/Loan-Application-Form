import { useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function calculateAge(date) {
  if (!date) return null;

  const dob = new Date(date);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const month = today.getMonth() - dob.getMonth();

  if (
    month < 0 ||
    (month === 0 &&
      today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

function DobField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const dob = watch("dob");

  const age = calculateAge(dob);

  return (
    <div className="space-y-2">
      <Input
        type="date"
        label="Date of Birth"
        required
        max={new Date().toISOString().split("T")[0]}
        error={errors.dob?.message}
        {...register("dob")}
      />

      {age !== null && (
        <p className="text-sm text-indigo-600 font-medium">
          🎂 Age: {age} years
        </p>
      )}
    </div>
  );
}

export default DobField;