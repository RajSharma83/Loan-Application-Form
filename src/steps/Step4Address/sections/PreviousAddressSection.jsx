import { useFormContext } from "react-hook-form";

import CountryField from "../fields/CountryField";
import StateField from "../fields/StateField";
import CityField from "../fields/CityField";
import PinCodeField from "../fields/PinCodeField";
import AddressLine1Field from "../fields/AddressLine1Field";
import AddressLine2Field from "../fields/AddressLine2Field";
import SameAsCurrentCheckbox from "../fields/SameAsCurrentCheckbox";

function PreviousAddressSection() {
  const { watch } = useFormContext();

  const yearsAtAddress = Number(watch("yearsAtAddress"));

  if (!yearsAtAddress || yearsAtAddress >= 1) {
    return null;
  }

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Previous Address
        </h3>

        <SameAsCurrentCheckbox />

        <p className="mt-1 text-sm text-slate-500">
          Since you've lived at your current address for less than one
          year, please provide your previous address.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CountryField
    name="previousCountry"
/>

<StateField
    name="previousState"
    countryName="previousCountry"
/>

<CityField
    name="previousCity"
    countryName="previousCountry"
    stateName="previousState"
/>

<PinCodeField
    name="previousPinCode"
    countryName="previousCountry"
    stateName="previousState"
    cityName="previousCity"
/>

<AddressLine1Field
    name="previousAddress1"
/>

<AddressLine2Field
    name="previousAddress2"
/>
      </div>
    </section>
  );
}

export default PreviousAddressSection;