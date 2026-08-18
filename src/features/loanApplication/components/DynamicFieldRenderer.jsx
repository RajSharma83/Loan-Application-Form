import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

import CompanyAutocompleteField from "../../../steps/Step5Employment/fields/CompanyAutocompleteField";

import CountryField from "../../../steps/Step4Address/fields/CountryField";
import StateField from "../../../steps/Step4Address/fields/StateField";
import CityField from "../../../steps/Step4Address/fields/CityField";
import PinCodeField from "../../../steps/Step4Address/fields/PinCodeField";
import AddressLine1Field from "../../../steps/Step4Address/fields/AddressLine1Field";
import AddressLine2Field from "../../../steps/Step4Address/fields/AddressLine2Field";

function DynamicFieldRenderer({ fields = [] }) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="grid gap-6">
      {fields.map((field) => {
        switch (field.type) {
          /* ==================================================
             TEXT
             ================================================== */
          case "text":
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue=""
                render={({ field: controllerField }) => (
                  <Input
                    {...controllerField}
                    value={controllerField.value ?? ""}
                    label={field.label}
                    placeholder={field.placeholder}
                    required={field.required}
                    error={errors[field.name]?.message}
                  />
                )}
              />
            );

          /* ==================================================
             CURRENCY
             ================================================== */
          case "currency":
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue=""
                render={({ field: controllerField }) => {
                  const rawValue =
                    controllerField.value ?? "";

                  const formatCurrency = (value) => {
                    if (!value) return "";

                    const numericValue = String(value).replace(
                      /\D/g,
                      ""
                    );

                    if (!numericValue) return "";

                    return new Intl.NumberFormat(
                      "en-IN"
                    ).format(Number(numericValue));
                  };

                  const handleChange = (event) => {
                    const numericValue =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    controllerField.onChange(numericValue);
                  };

                  return (
                    <Input
                      name={controllerField.name}
                      ref={controllerField.ref}
                      value={formatCurrency(rawValue)}
                      onChange={handleChange}
                      onBlur={controllerField.onBlur}
                      type="text"
                      inputMode="numeric"
                      label={field.label}
                      placeholder="Enter amount"
                      required={field.required}
                      error={errors[field.name]?.message}
                    />
                  );
                }}
              />
            );

          /* ==================================================
             SELECT
             ================================================== */
          case "select":
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue=""
                render={({ field: controllerField }) => (
                  <Select
                    {...controllerField}
                    value={controllerField.value ?? ""}
                    label={field.label}
                    required={field.required}
                    error={errors[field.name]?.message}
                  >
                    <option value="">
                      Select an option
                    </option>

                    {(field.options || []).map(
                      (option) => {
                        if (typeof option === "string") {
                          return (
                            <option
                              key={option}
                              value={option}
                            >
                              {option}
                            </option>
                          );
                        }

                        return (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        );
                      }
                    )}
                  </Select>
                )}
              />
            );

          /* ==================================================
             TEXTAREA
             ================================================== */
          case "textarea":
            return (
              <Controller
                key={field.name}
                name={field.name}
                control={control}
                defaultValue=""
                render={({ field: controllerField }) => (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      {field.label}

                      {field.required && (
                        <span className="ml-1 text-red-500">
                          *
                        </span>
                      )}
                    </label>

                    <textarea
                      {...controllerField}
                      value={controllerField.value ?? ""}
                      rows={4}
                      placeholder={field.placeholder}
                      className="neu-inset w-full rounded-xl px-4 py-3 text-slate-800 outline-none transition-all duration-200"
                    />

                    {errors[field.name] && (
                      <p className="text-sm text-red-500">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                )}
              />
            );

          /* ==================================================
             AUTOCOMPLETE
             
             IMPORTANT:
             field.options is passed through.
             
             Therefore:
             companyName -> companies
             jobTitle    -> designations
             ================================================== */
          case "autocomplete":
            return (
              <CompanyAutocompleteField
                key={field.name}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                options={field.options}
                optionIcon={field.optionIcon}
              />
            );

          /* ==================================================
             COUNTRY
             ================================================== */
          case "country":
            return (
              <CountryField
                key={field.name}
                name={field.name}
                label={field.label || "Country"}
              />
            );

          /* ==================================================
             STATE
             ================================================== */
          case "state":
            return (
              <StateField
                key={field.name}
                name={field.name}
                countryName={field.countryName}
                label={field.label || "State"}
              />
            );

          /* ==================================================
             CITY
             ================================================== */
          case "city":
            return (
              <CityField
                key={field.name}
                name={field.name}
                countryName={field.countryName}
                stateName={field.stateName}
                label={field.label || "City"}
              />
            );

          /* ==================================================
             PIN
             ================================================== */
          case "pin":
            return (
              <PinCodeField
                key={field.name}
                name={field.name}
                countryName={field.countryName}
                stateName={field.stateName}
                cityName={field.cityName}
                label={field.label || "PIN Code"}
              />
            );

          /* ==================================================
             ADDRESS LINE 1
             ================================================== */
          case "address1":
            return (
              <AddressLine1Field
                key={field.name}
                name={field.name}
                label={
                  field.label ||
                  "Address Line 1"
                }
              />
            );

          /* ==================================================
             ADDRESS LINE 2
             ================================================== */
          case "address2":
            return (
              <AddressLine2Field
                key={field.name}
                name={field.name}
                label={
                  field.label ||
                  "Address Line 2"
                }
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export default DynamicFieldRenderer;