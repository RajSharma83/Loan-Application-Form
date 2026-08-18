function SummaryRow({ label, value, mask }) {
  let displayValue = value;

  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    displayValue = "—";
  }

  if (value instanceof File) {
    displayValue = value.name;
  }

  if (
    displayValue !== "—" &&
    typeof mask === "function"
  ) {
    displayValue = mask(displayValue);
  }

  return (
    <div className="review-summary-row">
      <span>{label}</span>
      <strong>{String(displayValue)}</strong>
    </div>
  );
}

export default SummaryRow;
