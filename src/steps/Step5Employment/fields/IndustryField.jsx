import { useFormContext } from "react-hook-form";

import Select from "../../../components/ui/Select";
import industries from "../constants/industries";

function IndustryField({
  name,
  label,
  required,
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Select
      label={label}
      required={required}
      error={errors[name]?.message}
      {...register(name)}
    >
      <option value="">
        Select Industry
      </option>

      {industries.map((industry) => (
        <option
          key={industry}
          value={industry}
        >
          {industry}
        </option>
      ))}
    </Select>
  );
}

export default IndustryField;