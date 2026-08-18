import { Controller, useFormContext } from "react-hook-form";
import { City } from "country-state-city";

import Select from "../../../components/ui/Select";

function CityField({
  name = "city",
  countryName = "country",
  stateName = "state",
  label = "City",
}) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedCountry = watch(countryName);
  const selectedState = watch(stateName);

  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(
          selectedCountry,
          selectedState
        )
      : [];

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
          disabled={!selectedCountry || !selectedState}
          error={errors[name]?.message}
        >
          <option value="">
            {!selectedCountry
              ? "Select Country First"
              : !selectedState
              ? "Select State First"
              : "Select City"}
          </option>

          {cities.map((city) => (
            <option
              key={`${city.name}-${city.stateCode}`}
              value={city.name}
            >
              {city.name}
            </option>
          ))}
        </Select>
      )}
    />
  );
}

export default CityField;