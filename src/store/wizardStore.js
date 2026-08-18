import { create } from "zustand";

import {
  getNextVisibleStepId,
  getPreviousVisibleStepId,
} from "../utils/visibleSteps";

const TOTAL_STEPS = 9;

const useWizardStore = create((set) => ({
  currentStep: 1,
  totalSteps: TOTAL_STEPS,

  formData: {},

  panVerified: false,
  panResult: null,

  aadhaarVerified: false,
  aadhaarResult: null,

  setFormData: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    })),

  resetForm: () =>
    set({
      currentStep: 1,
      formData: {},

      panVerified: false,
      aadhaarVerified: false,

      panResult: null,
      aadhaarResult: null,
    }),

  // Skips over conditionally-hidden steps (e.g. Co-Applicant) based on
  // the current formData, rather than always moving id ± 1.
  nextStep: () =>
    set((state) => ({
      currentStep: getNextVisibleStepId(state.currentStep, state.formData),
    })),

  previousStep: () =>
    set((state) => ({
      currentStep: getPreviousVisibleStepId(
        state.currentStep,
        state.formData
      ),
    })),

  goToStep: (step) =>
    set((state) => ({
      currentStep:
        step >= 1 && step <= state.totalSteps
          ? step
          : state.currentStep,
    })),

  setPanVerified: (value) =>
    set({
      panVerified: value,
    }),

  setPanResult: (result) =>
    set({
      panResult: result,
    }),


  setAadhaarVerified: (value) =>
    set({
      aadhaarVerified: value,
    }),

  setAadhaarResult: (result) =>
    set({
      aadhaarResult: result,
    }),

  // Whether we've already checked localStorage for a resumable draft
  // this session — prevents re-prompting on every navigation.
  draftChecked: false,
  setDraftChecked: (value) => set({ draftChecked: value }),

  // Restore a previously saved draft (see utils/draftStorage.js).
  hydrateFromDraft: (draft) =>
    set({
      currentStep: draft.currentStep,
      formData: draft.formData ?? {},
      panVerified: Boolean(draft.panVerified),
      aadhaarVerified: Boolean(draft.aadhaarVerified),
      draftChecked: true,
    }),


  lastSavedAt: null,
  manualSaveRequested: false,
  requestManualSave: () => set({ manualSaveRequested: true }),
  markSaved: () =>
    set({ lastSavedAt: Date.now(), manualSaveRequested: false }),
}));

export default useWizardStore;