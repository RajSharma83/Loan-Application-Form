import { forwardRef, useId } from "react";
import clsx from "clsx";
import { getFieldIcon } from "../fieldIcons";

const Input = forwardRef(function Input(
  {
    id,
    label,
    error,
    className,
    required = false,
    icon: Icon,
    ...props
  },
  ref
) {
  const generatedId = useId();

  const inputId = id || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const ResolvedIcon = Icon || getFieldIcon(props.name, label);

  return (
    <div className="space-y-2">
      {/* =====================================================
          LABEL
          ===================================================== */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-semibold text-slate-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </label>
      )}

      {/* =====================================================
          INPUT WRAPPER
          ===================================================== */}
      <div className="relative w-full">
        {/* ===================================================
            ICON
            =================================================== */}
        {ResolvedIcon && (
          <ResolvedIcon
            size={18}
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-slate-400"
          />
        )}

        {/* ===================================================
            INPUT
            =================================================== */}
        <input
          id={inputId}
          ref={ref}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          aria-required={required}
          {...props}
          className={clsx(
            /* Base */
            "neu-inset w-full min-h-[44px] rounded-xl text-slate-800 outline-none transition-all duration-200",

            /* IMPORTANT:
               Don't use px-4 together with pl-11.
               Explicitly set left/right padding based on
               whether an icon exists.
            */
            ResolvedIcon
              ? "pl-[48px] pr-4"
              : "px-4",

            /* Placeholder */
            "placeholder:text-slate-400",

            /* Error */
            error && "neu-inset-error",

            className
          )}
        />
      </div>

      {/* =====================================================
          ERROR
          ===================================================== */}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-500"
        >
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;