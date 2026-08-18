import { useFormContext } from "react-hook-form";
import Input from "../../../components/ui/Input";

function RentAmountField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      type="number"
      label="Monthly Rent"
      required
      placeholder="Enter monthly rent"
      error={errors.monthlyRent?.message}
      {...register("monthlyRent")}
    />
  );
}

export default RentAmountField;