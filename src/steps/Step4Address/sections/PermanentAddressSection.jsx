import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import CountryField from "../fields/CountryField";
import StateField from "../fields/StateField";
import CityField from "../fields/CityField";
import PinCodeField from "../fields/PinCodeField";
import AddressLine1Field from "../fields/AddressLine1Field";
import AddressLine2Field from "../fields/AddressLine2Field";

/**
 * Permanent Address — distinct from "Previous Address" (which only
 * appears when the applicant has lived at their current address for
 * under a year). Permanent address is always collected, with a
 * "same as current" shortcut.
 */
function PermanentAddressSection() {
  const { register, watch, setValue } = useFormContext();

  const sameAsCurrent = watch("permanentSameAsCurrent");

  const country = watch("country");
  const state = watch("state");
  const city = watch("city");
  const pinCode = watch("pinCode");
  const address1 = watch("address1");
  const address2 = watch("address2");

  useEffect(() => {
    if (!sameAsCurrent) return;

    setValue("permanentCountry", country, { shouldValidate: true });
    setValue("permanentState", state, { shouldValidate: true });
    setValue("permanentCity", city, { shouldValidate: true });
    setValue("permanentPinCode", pinCode, { shouldValidate: true });
    setValue("permanentAddress1", address1, { shouldValidate: true });
    setValue("permanentAddress2", address2, { shouldValidate: true });
  }, [
    sameAsCurrent,
    country,
    state,
    city,
    pinCode,
    address1,
    address2,
    setValue,
  ]);

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Permanent Address
        </h3>

        <label className="mt-2 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            {...register("permanentSameAsCurrent")}
            className="skeu-checkbox"
          />

          <span className="text-sm font-medium">
            Same as Current Address
          </span>
        </label>
      </div>

      {!sameAsCurrent && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <CountryField name="permanentCountry" label="Country" />

          <StateField
            name="permanentState"
            countryName="permanentCountry"
            label="State"
          />

          <CityField
            name="permanentCity"
            countryName="permanentCountry"
            stateName="permanentState"
            label="City"
          />

          <PinCodeField
            name="permanentPinCode"
            countryName="permanentCountry"
            stateName="permanentState"
            cityName="permanentCity"
            label="PIN Code"
          />

          <AddressLine1Field name="permanentAddress1" label="Address Line 1" />
          <AddressLine2Field name="permanentAddress2" label="Address Line 2" />
        </div>
      )}
    </section>
  );
}

export default PermanentAddressSection;
