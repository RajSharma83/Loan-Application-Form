import { Check } from "lucide-react";
import { useFormContext } from "react-hook-form";

import useWizardStore from "../../store/wizardStore";
import { getVisibleSteps } from "../../utils/visibleSteps";

function StepIndicator() {
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

  return (
    <div className="step-indicator-wrapper">
      <div className="step-indicator-row">
        {visibleSteps.map((step, index) => {
          const completed = step.id < currentStep;
          const active = step.id === currentStep;

          return (
            <div
              key={step.id}
              data-testid="step-pill"
              data-step-id={step.id}
              className="step-item"
            >
              {/* =================================================
                  STEP NUMBER
                  ================================================= */}
              <div
                className={`step-circle ${
                  completed
                    ? "step-circle-complete"
                    : active
                    ? "step-circle-active"
                    : "step-circle-upcoming"
                }`}
              >
                {completed ? (
                  <Check
                    size={15}
                    strokeWidth={3}
                  />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* =================================================
                  STEP NAME
                  ================================================= */}
              <p
                className={`step-title ${
                  active
                    ? "step-title-active"
                    : completed
                    ? "step-title-complete"
                    : ""
                }`}
              >
                {step.title}
              </p>

              {/* =================================================
                  CONNECTOR
                  ================================================= */}
              {index < visibleSteps.length - 1 && (
                <div
                  className={`step-connector ${
                    completed
                      ? "step-connector-complete"
                      : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;