import steps from "../constants/steps";

export function isStepVisible(step, formData) {
  if (typeof step.isVisible !== "function") return true;
  return step.isVisible(formData ?? {});
}

export function getVisibleSteps(formData) {
  return steps.filter((step) => isStepVisible(step, formData));
}

export function getNextVisibleStepId(currentStepId, formData) {
  const visible = getVisibleSteps(formData);
  const index = visible.findIndex((step) => step.id === currentStepId);

  if (index === -1 || index === visible.length - 1) return currentStepId;

  return visible[index + 1].id;
}

export function getPreviousVisibleStepId(currentStepId, formData) {
  const visible = getVisibleSteps(formData);
  const index = visible.findIndex((step) => step.id === currentStepId);

  if (index <= 0) return currentStepId;

  return visible[index - 1].id;
}
