import { useFormContext } from "react-hook-form";
import Select from "../../../components/ui/Select";

function MaritalStatusField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select
      label="Marital Status"
      required
      {...register("maritalStatus")}
      error={errors.maritalStatus?.message}
    >
      <option value="">Select Status</option>
      <option value="single">Single</option>
      <option value="married">Married</option>
      <option value="divorced">Divorced</option>
      <option value="widowed">Widowed</option>
    </Select>
  );
}

export default MaritalStatusField;