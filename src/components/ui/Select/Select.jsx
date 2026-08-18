import { forwardRef, useId } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { getFieldIcon } from "../fieldIcons";

const Select = forwardRef(function Select(
  {
    id,
    label,
    error,
    children,
    className,
    required = false,
    icon: Icon,
    ...props
  },
  ref
) {
  const generatedId = useId();

  const selectId = id || generatedId;

  const errorId = error
    ? `${selectId}-error`
    : undefined;
  const ResolvedIcon = Icon || getFieldIcon(props.name, label);

  return (
    <div className="loan-field">
      {label && (
        <label
          htmlFor={selectId}
          className="loan-field-label"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      <div className="loan-input-wrapper">
        {ResolvedIcon && (
          <ResolvedIcon
            size={19}
            aria-hidden="true"
            className="loan-input-icon"
          />
        )}

        <select
          id={selectId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          aria-required={required}
          {...props}
          className={clsx(
            "loan-input loan-select",
            ResolvedIcon && "loan-input-with-icon",
            error && "loan-input-error",
            className
          )}
        >
          {children}
        </select>

        <ChevronDown
          size={18}
          aria-hidden="true"
          className="loan-select-chevron"
        />
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;