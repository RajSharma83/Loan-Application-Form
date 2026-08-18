import { useEffect, useState } from "react";
import { Check, Save } from "lucide-react";

import useWizardStore from "../store/wizardStore";

function timeAgoLabel(timestamp) {
  if (!timestamp) return null;

  const seconds = Math.floor(
    (Date.now() - timestamp) / 1000
  );

  if (seconds < 5) return "Saved just now";

  if (seconds < 60) {
    return `Saved ${seconds}s ago`;
  }

  const minutes = Math.floor(seconds / 60);

  return `Saved ${minutes}m ago`;
}

function AppHeader({
  title = "Loan Application",
  subtitle = "Complete your loan application through a secure, guided experience. Your progress is automatically saved while you move between steps.",
  showSaveDraft = true,
}) {
  const lastSavedAt = useWizardStore(
    (state) => state.lastSavedAt
  );

  const manualSaveRequested = useWizardStore(
    (state) => state.manualSaveRequested
  );

  const requestManualSave = useWizardStore(
    (state) => state.requestManualSave
  );

  const [, forceTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      forceTick((t) => t + 1);
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  const savedLabel = timeAgoLabel(lastSavedAt);

  return (
    <header className="app-header">
      {/* ===================================================
          HEADER LEFT
          =================================================== */}
      <div className="app-header-copy">
        <h1 className="app-title">
          {title}
        </h1>

        {subtitle && (
          <p className="app-subtitle">
            {subtitle}
          </p>
        )}
      </div>

      {/* ===================================================
          HEADER ACTIONS
          =================================================== */}
      {showSaveDraft && (
        <div className="app-header-actions">
          {savedLabel && !manualSaveRequested && (
            <span className="save-status">
              <Check size={16} />
              {savedLabel}
            </span>
          )}

          <button
            type="button"
            onClick={requestManualSave}
            disabled={manualSaveRequested}
            aria-live="polite"
            className="save-draft-button"
          >
            <Save size={18} />

            <span>
              {manualSaveRequested
                ? "Saving..."
                : "Save Draft"}
            </span>
          </button>
        </div>
      )}
    </header>
  );
}

export default AppHeader;