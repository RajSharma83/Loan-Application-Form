import { useFormContext } from "react-hook-form";

import useWizardStore from "../../store/wizardStore";
import { getVisibleSteps } from "../../utils/visibleSteps";

function ProgressBar() {
  const currentStep = useWizardStore(
    (state) => state.currentStep
  );

  const { watch } = useFormContext();

  const loanType = watch("loanType");
  const loanAmount = watch("loanAmount");

  const visibleSteps = getVisibleSteps({
    loanType,
    loanAmount,
  });

  const position =
    visibleSteps.findIndex(
      (step) => step.id === currentStep
    ) + 1;

  const total = visibleSteps.length;

  const progress =
    total > 0
      ? Math.round((position / total) * 100)
      : 0;

  return (
    <div className="progress-header">
      {/* LEFT */}
      <div>
        <p className="progress-label">
          Application Progress
        </p>

        <h2 className="progress-step">
          Step {position} of {total}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="progress-complete-badge">
        {progress}% Complete
      </div>
    </div>
  );
}

export default ProgressBar;