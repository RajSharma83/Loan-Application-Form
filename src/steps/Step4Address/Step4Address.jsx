import { useFormContext } from "react-hook-form";

import CountryField from "./fields/CountryField";
import StateField from "./fields/StateField";
import CityField from "./fields/CityField";
import PinCodeField from "./fields/PinCodeField";
import AddressLine1Field from "./fields/AddressLine1Field";
import AddressLine2Field from "./fields/AddressLine2Field";
import ResidentialStatusField from "./fields/ResidentialStatusField";
import YearsAtAddressField from "./fields/YearsAtAddressField";
import RentAmountField from "./fields/RentAmountField";

import PreviousAddressSection from "./sections/PreviousAddressSection";
import PermanentAddressSection from "./sections/PermanentAddressSection";

function Step4Address() {
  const { watch } = useFormContext();

  const residentialStatus = watch("residentialStatus");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Address Details
        </h2>

        <p className="mt-2 text-slate-500">
          Tell us where you currently live.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CountryField />
        <StateField />

        <CityField />
        <PinCodeField />

        <AddressLine1Field />
        <AddressLine2Field />

        <ResidentialStatusField />

        {residentialStatus === "rented" && (
          <RentAmountField />
        )}

        <YearsAtAddressField />
      </div>

      <PermanentAddressSection />

      <PreviousAddressSection />
    </div>
  );
}

export default Step4Address;