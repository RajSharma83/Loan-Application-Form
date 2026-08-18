import clsx from "clsx";

function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  // Filled (brand-coloured) variants get skeu-btn-filled (shadow tuned
  // for saturated backgrounds); pale/outline variants get skeu-btn
  // (shadow tuned for the app's light surface) — same tactile
  // press/lift physics either way, per the design system.
  const variants = {
    primary:
      "skeu-btn-filled bg-indigo-600 text-white hover:bg-indigo-700",

    secondary:
      "skeu-btn bg-slate-100 text-slate-800 hover:bg-slate-50",

    outline:
      "skeu-btn border border-slate-200 bg-slate-50 hover:bg-white",

    danger:
      "skeu-btn-filled bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm min-h-[44px]",

    md: "px-5 py-3 min-h-[44px]",

    lg: "px-6 py-4 text-lg min-h-[52px]",
  };

  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={clsx(
        "rounded-xl font-medium transition-colors duration-200",
        "disabled:cursor-not-allowed",
        "focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;