import { useFormContext } from "react-hook-form";
import Select from "../../../components/ui/Select";

function GenderField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select
      label="Gender"
      required
      {...register("gender")}
      error={errors.gender?.message}
    >
      <option value="">Select Gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="other">Other</option>
    </Select>
  );
}

export default GenderField;