import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function capitalizeName(value) {
  return value
    .replace(/[^A-Za-z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trimStart();
}

function LastNameField() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="lastName"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          {...field}
          label="Last Name"
          required
          placeholder="Enter last name"
          value={field.value ?? ""}
          error={errors.lastName?.message}
          onChange={(e) =>
            field.onChange(capitalizeName(e.target.value))
          }
        />
      )}
    />
  );
}

export default LastNameField;