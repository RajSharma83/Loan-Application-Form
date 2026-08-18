import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Building2,
  BriefcaseBusiness,
  Search,
} from "lucide-react";

import Input from "../../../components/ui/Input";
import companies from "../constants/companies";

function CompanyAutocompleteField({
  name,
  label,
  placeholder,
  required,
  options = companies,
  optionIcon = "company",
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return options.slice(0, 8);
    }

    return options
      .filter((option) =>
        option.toLowerCase().includes(normalizedQuery)
      )
      .slice(0, 8);
  }, [options, query]);

  const Icon =
    optionIcon === "designation"
      ? BriefcaseBusiness
      : Building2;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue=""
      render={({ field }) => {
        const value = field.value ?? "";

        const handleSelect = (option) => {
          field.onChange(option);
          setQuery(option);
          setIsOpen(false);
        };

        return (
          <div className="relative z-30">
            <Input
              name={field.name}
              ref={field.ref}
              value={value}
              onChange={(event) => {
                const nextValue = event.target.value;

                field.onChange(nextValue);
                setQuery(nextValue);
                setIsOpen(true);
              }}
              onBlur={() => {
                field.onBlur();

                // Delay closing very slightly so a mouse/pointer
                // selection can complete before the menu closes.
                window.setTimeout(() => {
                  setIsOpen(false);
                }, 180);
              }}
              onFocus={() => {
                setQuery(value);
                setIsOpen(true);
              }}
              label={label}
              placeholder={placeholder}
              required={required}
              error={errors[name]?.message}
              autoComplete="off"
            />

            {isOpen && filteredOptions.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl"
                role="listbox"
              >
                {filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={option === value}
                    onMouseDown={(event) => {
                      // Prevent input blur from closing the dropdown
                      // before the option click is processed.
                      event.preventDefault();
                    }}
                    onClick={() => handleSelect(option)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                  >
                    {optionIcon === "search" ? (
                      <Search
                        size={16}
                        className="shrink-0 text-slate-400"
                      />
                    ) : (
                      <Icon
                        size={17}
                        className="shrink-0 text-indigo-500"
                      />
                    )}

                    <span className="min-w-0 truncate">
                      {option}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  );
}

export default CompanyAutocompleteField;