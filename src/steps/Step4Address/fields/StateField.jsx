import { State } from "country-state-city";
import { Controller, useFormContext } from "react-hook-form";
import { AlertTriangle } from "lucide-react";

import Select from "../../../components/ui/Select";

function StateField({
  name = "state",
  countryName = "country",
  label = "State",
}) {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const selectedCountry = watch(countryName);
  const selectedState = watch(name);
  const pinDerivedState = watch(`${name}PinDerived`);

  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry)
    : [];

  // Warn (don't block) if the user has edited the state away from
  // what the PIN code lookup determined — per JD Section A3.3.
  const hasMismatch =
    pinDerivedState &&
    selectedState &&
    pinDerivedState !== selectedState;

  const pinDerivedStateName = hasMismatch
    ? states.find((s) => s.isoCode === pinDerivedState)?.name
    : null;

  return (
    <div>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <Select
            {...field}
            label={label}
            required
            disabled={!selectedCountry}
            error={errors[name]?.message}
          >
            <option value="">
              {!selectedCountry
                ? "Select Country First"
                : "Select State"}
            </option>

            {states.map((state) => (
              <option
                key={state.isoCode}
                value={state.isoCode}
              >
                {state.name}
              </option>
            ))}
          </Select>
        )}
      />

      {hasMismatch && pinDerivedStateName && (
        <p
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-sm text-amber-600"
        >
          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
          The PIN code you entered maps to {pinDerivedStateName}, which
          doesn't match the state selected above. Please double-check.
        </p>
      )}
    </div>
  );
}

export default StateField;