import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

function SameAsCurrentCheckbox() {
  const { register, watch, setValue } = useFormContext();

  const sameAddress = watch("sameAsCurrent");

  const country = watch("country");
  const state = watch("state");
  const city = watch("city");
  const pinCode = watch("pinCode");
  const address1 = watch("address1");
  const address2 = watch("address2");

  useEffect(() => {
    if (sameAddress) {
      setValue("previousCountry", country);
      setValue("previousState", state);
      setValue("previousCity", city);
      setValue("previousPinCode", pinCode);
      setValue("previousAddress1", address1);
      setValue("previousAddress2", address2);
    } else {
      setValue("previousCountry", "");
      setValue("previousState", "");
      setValue("previousCity", "");
      setValue("previousPinCode", "");
      setValue("previousAddress1", "");
      setValue("previousAddress2", "");
    }
  }, [
    sameAddress,
    country,
    state,
    city,
    pinCode,
    address1,
    address2,
    setValue,
  ]);

  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input
        type="checkbox"
        {...register("sameAsCurrent")}
        className="skeu-checkbox"
      />

      <span className="text-sm font-medium">
        Same as Current Address
      </span>
    </label>
  );
}

export default SameAsCurrentCheckbox;