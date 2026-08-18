import { Controller, useFormContext } from "react-hook-form";

import Input from "./Input";
import {
  formatCurrencyDisplay,
  parseCurrencyInput,
} from "../../../utils/formatCurrency";

function CurrencyInput({
  name,
  label,
  required,
  readOnly,
  ...rest
}) {
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
          name={field.name}
          ref={field.ref}
          value={formatCurrencyDisplay(field.value)}
          onChange={(event) =>
            field.onChange(
              parseCurrencyInput(event.target.value)
            )
          }
          onBlur={field.onBlur}
          type="text"
          inputMode="numeric"
          label={label}
          required={required}
          readOnly={readOnly}
          error={errors[name]?.message}
          {...rest}
        />
      )}
    />
  );
}

export default CurrencyInput;