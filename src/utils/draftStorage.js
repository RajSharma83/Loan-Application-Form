import {
  encryptToStorage,
  decryptFromStorage,
  removeFromStorage,
} from "./secureStorage";
import steps from "../constants/steps";

export const DRAFT_SCHEMA_VERSION = 1;
export const DRAFT_TTL_MS = 72 * 60 * 60 * 1000; // 72 hours
export const DRAFT_STORAGE_KEY = "zetheta:loan-draft:v1";

/**
 * Persist a snapshot of the wizard's progress.
 * Non-blocking: callers should not await this on the UI thread's
 * critical path (it's already invoked from a debounced/interval timer).
 */
export async function saveDraft({
  currentStep,
  formData,
  panVerified,
  aadhaarVerified,
}) {
  const draft = {
    schemaVersion: DRAFT_SCHEMA_VERSION,
    timestamp: Date.now(),
    loanType: formData?.loanType ?? null,
    currentStep,
    formData,
    panVerified: Boolean(panVerified),
    aadhaarVerified: Boolean(aadhaarVerified),
  };

  return encryptToStorage(DRAFT_STORAGE_KEY, draft);
}

function isExpired(draft) {
  return Date.now() - draft.timestamp > DRAFT_TTL_MS;
}

function isValidAgainstCurrentSchema(draft) {
  if (!draft || typeof draft !== "object") return false;
  if (draft.schemaVersion !== DRAFT_SCHEMA_VERSION) return false;
  if (!draft.formData || typeof draft.formData !== "object") return false;

  const stepExists = steps.some((step) => step.id === draft.currentStep);
  if (!stepExists) return false;

  return true;
}

/**
 * Returns the draft if it exists, is unexpired, and matches the current
 * form schema version — otherwise returns null and clears anything
 * stale/corrupted it finds along the way.
 */
export async function loadValidDraft() {
  const draft = await decryptFromStorage(DRAFT_STORAGE_KEY);

  if (!draft) return null;

  if (isExpired(draft)) {
    clearDraft();
    return null;
  }

  if (!isValidAgainstCurrentSchema(draft)) {
    clearDraft();
    return null;
  }

  return draft;
}

export function clearDraft() {
  removeFromStorage(DRAFT_STORAGE_KEY);
}
