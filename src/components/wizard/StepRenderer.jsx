import useWizardStore from "../../store/wizardStore";
import steps from "../../constants/steps";

function StepRenderer() {
  const currentStep = useWizardStore((state) => state.currentStep);

  const activeStep = steps.find((step) => step.id === currentStep);

  if (!activeStep) {
    return (
      <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-center text-red-600">
        Invalid Step
      </div>
    );
  }

  const ActiveComponent = activeStep.component;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 w-full">
      <ActiveComponent />
    </div>
  );
}

export default StepRenderer;