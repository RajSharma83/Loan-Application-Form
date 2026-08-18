import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { State, City } from "country-state-city";

import Input from "../../../components/ui/Input";
import usePinCodeLookup from "../../../features/address/hooks/usePinCodeLookup";

function PinCodeField({
  name = "pinCode",
  countryName = "country",
  stateName = "state",
  cityName = "city",
  label = "PIN Code",
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const pinCode = watch(name);
  const selectedCountry = watch(countryName);
  const selectedState = watch(stateName);

  const previousPin = useRef("");
  const pendingCity = useRef(null);

  const { lookup, loading, error } = usePinCodeLookup();

  // -------------------------------------------------
  // Clear old values whenever PIN changes
  // -------------------------------------------------

  useEffect(() => {
    previousPin.current = "";
    pendingCity.current = null;

    setValue(stateName, "");
    setValue(cityName, "");
    setValue(`${stateName}PinDerived`, "");
  }, [pinCode, stateName, cityName, setValue]);

  // -------------------------------------------------
  // PIN Lookup
  // -------------------------------------------------

  useEffect(() => {
    if (
      !selectedCountry ||
      !pinCode ||
      pinCode.length !== 6
    ) {
      return;
    }

    if (previousPin.current === pinCode) {
      return;
    }

    previousPin.current = pinCode;

    const fetchLocation = async () => {
      try {
        const data = await lookup(pinCode);

        // ------------------------
        // Find State
        // ------------------------

        const states =
          State.getStatesOfCountry(selectedCountry);

        const matchedState = states.find(
          (state) =>
            state.name.toLowerCase() ===
            data.state.toLowerCase()
        );

        if (!matchedState) return;

        // Store the PIN-derived state separately (namespaced by field,
        // since this component is reused for current/permanent/office
        // addresses) so StateField can warn if the user later edits
        // the state dropdown to something that no longer matches.
        setValue(`${stateName}PinDerived`, matchedState.isoCode, {
          shouldValidate: false,
        });

        setValue(stateName, matchedState.isoCode, {
          shouldValidate: true,
          shouldDirty: true,
        });

        // ------------------------
        // Find City
        // ------------------------

        const cities = City.getCitiesOfState(
          selectedCountry,
          matchedState.isoCode
        );

        const normalize = (text = "") =>
          text
            .toLowerCase()
            .trim()
            .replace(/bangalore/g, "bengaluru")
            .replace(/bengaluru urban/g, "bengaluru")
            .replace(/bengaluru rural/g, "bengaluru")
            .replace(/-/g, "")
            .replace(/\s+/g, "");

        const apiCity = normalize(data.city);

        const matchedCity = cities.find((city) => {
          const cityName = normalize(city.name);

          return (
            cityName === apiCity ||
            cityName.includes(apiCity) ||
            apiCity.includes(cityName)
          );
        });

        if (matchedCity) {
          pendingCity.current = matchedCity.name;
        }
      } catch (err) {
        console.error("PIN Lookup Error:", err);
      }
    };

    fetchLocation();
  }, [
    pinCode,
    selectedCountry,
    stateName,
    lookup,
    setValue,
  ]);

  // -------------------------------------------------
  // Wait until State updates then select City
  // -------------------------------------------------

  useEffect(() => {
    if (!selectedState) return;

    if (!pendingCity.current) return;

    setValue(cityName, pendingCity.current, {
      shouldValidate: true,
      shouldDirty: true,
    });

    pendingCity.current = null;
  }, [selectedState, cityName, setValue]);

  return (
    <div>
      <Input
        label={label}
        required
        placeholder="Enter PIN Code"
        maxLength={6}
        error={errors[name]?.message || error}
        {...register(name)}
      />

      {loading && (
        <p className="mt-2 text-sm text-indigo-600">
          Looking up PIN...
        </p>
      )}
    </div>
  );
}

export default PinCodeField;