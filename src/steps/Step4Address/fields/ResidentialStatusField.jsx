import { useFormContext } from "react-hook-form";
import Select from "../../../components/ui/Select";

function ResidentialStatusField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select
      label="Residential Status"
      required
      error={errors.residentialStatus?.message}
      {...register("residentialStatus")}
    >
      <option value="">Select</option>
      <option value="owned">Owned</option>
      <option value="rented">Rented</option>
      <option value="family">Family</option>
      <option value="company">Company Provided</option>
    </Select>
  );
}

export default ResidentialStatusField;