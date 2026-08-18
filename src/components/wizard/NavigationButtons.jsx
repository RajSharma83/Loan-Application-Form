import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";

import useWizardStore from "../../store/wizardStore";
import steps from "../../constants/steps";
import { saveDraft } from "../../utils/draftStorage";
import { getNextVisibleStepId } from "../../utils/visibleSteps";

function NavigationButtons() {
  const {
    currentStep,
    totalSteps,
    nextStep,
    previousStep,
    setFormData,
    panVerified,
    aadhaarVerified,
    markSaved,
  } = useWizardStore();

  const {
    trigger,
    getValues,
  } = useFormContext();

  const [isProcessing, setIsProcessing] = useState(false);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = async () => {
    // Guards against rapid double-clicks invoking this concurrently —
    // without it, two overlapping calls could both pass validation
    // and each call nextStep(), skipping a step.
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // Block Step 3 until both documents are verified
      if (
        currentStep === 3 &&
        (!panVerified || !aadhaarVerified)
      ) {
        alert(
          "Please verify both PAN and Aadhaar before continuing."
        );
        return;
      }

      const currentStepConfig = steps.find(
        (step) => step.id === currentStep
      );

      let fields = currentStepConfig?.fields ?? [];

      if (currentStep === 4) {
        const years = Number(getValues("yearsAtAddress"));

        if (years >= 1) {
          fields = fields.filter(
            (field) => !field.startsWith("previous")
          );
        }
      }

      const isValid =
        fields.length === 0
          ? true
          : await trigger(fields);

      if (!isValid) return;

      const values = getValues();

      setFormData(values);

      // Fire-and-forget: step transitions are a good moment to persist,
      // in addition to the ~30s background auto-save.
      saveDraft({
        currentStep: getNextVisibleStepId(currentStep, {
          ...values,
        }),
        formData: { ...values },
        panVerified,
        aadhaarVerified,
      }).then((success) => {
        if (success) markSaved();
      });

      nextStep();
    } finally {
      setIsProcessing(false);
    }
  };

 return (
  <div className="flex items-center justify-between gap-4">
    <button
      type="button"
      onClick={previousStep}
      disabled={isFirstStep || isProcessing}
      className="skeu-btn flex min-h-[52px] items-center gap-2 rounded-xl bg-white px-7 py-3 text-sm font-bold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      <ArrowLeft size={19} />
      Back
    </button>

    {isLastStep ? (
      <div />
    ) : (
      <button
        type="button"
        onClick={handleNext}
        disabled={isProcessing}
        aria-busy={isProcessing}
        className="skeu-btn-filled flex min-h-[52px] items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isProcessing
          ? "Please wait..."
          : "Continue"}

        <ArrowRight size={20} />
      </button>
    )}
  </div>
);
}

export default NavigationButtons;