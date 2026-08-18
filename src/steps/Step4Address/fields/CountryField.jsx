import { Country } from "country-state-city";
import { Controller, useFormContext } from "react-hook-form";

import Select from "../../../components/ui/Select";

function CountryField({
  name = "country",
  label = "Country",
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const countries = Country.getAllCountries();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => (
        <Select
          {...field}
          label={label}
          required
          error={errors[name]?.message}
        >
          <option value="">Select Country</option>

          {countries.map((country) => (
            <option
              key={country.isoCode}
              value={country.isoCode}
            >
              {country.name}
            </option>
            
          ))}
        </Select>
      )}
    />
  );
}

export default CountryField;