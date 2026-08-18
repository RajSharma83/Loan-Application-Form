import { useFormContext } from "react-hook-form";
import Input from "../../../components/ui/Input";

function YearsAtAddressField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      type="number"
      label="Years at Current Address"
      required
      placeholder="e.g. 5"
      error={errors.yearsAtAddress?.message}
      {...register("yearsAtAddress")}
    />
  );
}

export default YearsAtAddressField;