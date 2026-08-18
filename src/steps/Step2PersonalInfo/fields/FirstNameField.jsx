import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function capitalizeName(value) {
  return value
    .replace(/[^A-Za-z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trimStart();
}

function FirstNameField() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="firstName"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          {...field}
          label="First Name"
          required
          placeholder="Enter first name"
          value={field.value ?? ""}
          error={errors.firstName?.message}
          onChange={(e) =>
            field.onChange(capitalizeName(e.target.value))
          }
        />
      )}
    />
  );
}

export default FirstNameField;