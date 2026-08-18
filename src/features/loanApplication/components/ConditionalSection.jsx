import { useFormContext } from "react-hook-form";

import loanConfigRegistry from "../configs/loanConfigRegistry";
import DynamicFieldRenderer from "./DynamicFieldRenderer";

function ConditionalSection() {
  const { watch } = useFormContext();

  const loanType = watch("loanType") ?? "";

  if (!loanType) return null;

  const config = loanConfigRegistry[loanType];

  if (!config) return null;

  return (
    <section className="mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {config.title} Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Please provide the required information below.
        </p>
      </div>

      <DynamicFieldRenderer fields={config.fields} />
    </section>
  );
}

export default ConditionalSection;