import { Pencil } from "lucide-react";

import SummaryRow from "./SummaryRow";

function ReviewSection({
  title,
  step,
  fields,
  values = {},
  onEdit,
}) {
  const populatedFields = fields.filter((field) => {
    const value = values[field.key];
    return value !== undefined && value !== null && value !== "";
  });

  const displayFields = populatedFields.length
    ? populatedFields.slice(0, 8)
    : fields.slice(0, 8);

  return (
    <section className="review-summary-card">
      <div className="review-card-header">
        <div className="review-card-title-wrap">
          <div className="review-card-icon review-card-icon-indigo">
            <span className="review-section-dot" />
          </div>

          <div>
            <h3>{title}</h3>
            <p>Review the information entered in this section.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onEdit(step)}
          className="review-edit-button"
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>

      <div className="review-fields-grid">
        {displayFields.map((field) => (
          <SummaryRow
            key={field.key}
            label={field.label}
            value={values[field.key]}
            mask={field.mask}
          />
        ))}
      </div>
    </section>
  );
}

export default ReviewSection;
