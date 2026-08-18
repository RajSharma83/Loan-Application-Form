import { useFormContext } from "react-hook-form";

import employmentRegistry from "../../features/employment/configs/employmentRegistry";
import DynamicFieldRenderer from "../../features/loanApplication/components/DynamicFieldRenderer";

function EmploymentConditionalSection() {
  const { watch } = useFormContext();

  const employmentType = watch("employmentType");

  if (!employmentType) return null;

  const config = employmentRegistry[employmentType];

  if (!config) return null;

  return (
    <section className="mt-8 space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {config.title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please provide the required employment information.
        </p>
      </div>

      {config.sections.map((section) => (
        <div
          key={section.title}
          className="neu-surface rounded-2xl bg-white p-6"
        >
          <h3 className="mb-6 text-lg font-semibold text-slate-900">
            {section.title}
          </h3>

          <DynamicFieldRenderer fields={section.fields} />
        </div>
      ))}
    </section>
  );
}

export default EmploymentConditionalSection;