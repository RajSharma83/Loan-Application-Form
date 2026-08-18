import { useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function AlternateMobileField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      label="Alternate Mobile (Optional)"
      placeholder="10-digit alternate number"
      inputMode="numeric"
      maxLength={10}
      error={errors.alternateMobile?.message}
      {...register("alternateMobile", {
        onChange: (event) => {
          event.target.value = event.target.value.replace(/\D/g, "");
        },
      })}
    />
  );
}

export default AlternateMobileField;
