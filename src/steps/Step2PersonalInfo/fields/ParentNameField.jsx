import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function capitalizeName(value) {
  return value
    .replace(/[^A-Za-z\s'-]/g, "")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trimStart();
}

function ParentNameField({ name, label }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Input
          {...field}
          label={label}
          required
          placeholder={`Enter ${label.toLowerCase()}`}
          value={field.value ?? ""}
          error={errors[name]?.message}
          onChange={(e) =>
            field.onChange(capitalizeName(e.target.value))
          }
        />
      )}
    />
  );
}

export default ParentNameField;
