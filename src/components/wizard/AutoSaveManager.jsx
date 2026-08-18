import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";

import useWizardStore from "../../store/wizardStore";
import { saveDraft } from "../../utils/draftStorage";

const AUTO_SAVE_INTERVAL_MS = 30 * 1000;

/**
 * Silently persists the wizard's progress on a ~30s cadence.
 * Runs entirely off the main interaction path (setInterval + a
 * fire-and-forget async save), so it never blocks typing or navigation.
 */
function AutoSaveManager() {
  const { getValues } = useFormContext();

  const currentStep = useWizardStore((state) => state.currentStep);
  const storeFormData = useWizardStore((state) => state.formData);
  const panVerified = useWizardStore((state) => state.panVerified);
  const aadhaarVerified = useWizardStore((state) => state.aadhaarVerified);
  const setFormData = useWizardStore((state) => state.setFormData);
  const manualSaveRequested = useWizardStore(
    (state) => state.manualSaveRequested
  );
  const markSaved = useWizardStore((state) => state.markSaved);

  // Keep the latest values in a ref so the interval callback (set up once)
  // always reads fresh data without needing to be re-created every render.
  const latestRef = useRef({});

  useEffect(() => {
    latestRef.current = {
      currentStep,
      storeFormData,
      panVerified,
      aadhaarVerified,
    };
  }, [currentStep, storeFormData, panVerified, aadhaarVerified]);

  const persistRef = useRef(null);

  useEffect(() => {
    const persist = async () => {
      const liveValues = getValues();
      const { currentStep: step, storeFormData: saved, panVerified: pan, aadhaarVerified: aadhaar } =
        latestRef.current;

      const mergedFormData = { ...saved, ...liveValues };

      // Sync the live (unsaved-to-store) step values into the store too,
      // so "Back" navigation and the draft snapshot both stay current.
      setFormData(liveValues);

      const success = await saveDraft({
        currentStep: step,
        formData: mergedFormData,
        panVerified: pan,
        aadhaarVerified: aadhaar,
      });

      if (success) markSaved();
    };

    persistRef.current = persist;

    const intervalId = window.setInterval(persist, AUTO_SAVE_INTERVAL_MS);

    // Best-effort save if the user closes the tab / navigates away.
    const handlePageHide = () => persist();
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [getValues, setFormData, markSaved]);

  // The "Save Draft" button (AppHeader) lives outside the RHF form
  // context, so it just flips this flag — this effect is what actually
  // performs the save the moment it's requested.
  useEffect(() => {
    if (manualSaveRequested && persistRef.current) {
      persistRef.current();
    }
  }, [manualSaveRequested]);

  return null;
}

export default AutoSaveManager;
