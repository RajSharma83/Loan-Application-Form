import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function EmailField() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="email"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          {...field}
          type="email"
          label="Email Address"
          required
          placeholder="Enter email"
          value={field.value ?? ""}
          error={errors.email?.message}
          onChange={(e) =>
            field.onChange(
              e.target.value.trim().toLowerCase()
            )
          }
        />
      )}
    />
  );
}

export default EmailField;