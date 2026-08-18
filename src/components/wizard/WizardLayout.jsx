import FormProvider from "../form/FormProvider";

import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import StepRenderer from "./StepRenderer";
import NavigationButtons from "./NavigationButtons";
import AutoSaveManager from "./AutoSaveManager";

import AppShell from "../../layouts/AppShell";
import AppHeader from "../../layouts/AppHeader";
import PageContainer from "../../layouts/PageContainer";

function WizardLayout() {
  return (
    <AppShell>
      <PageContainer>
        {/* ==================================================
            FIXED HEADER
            ================================================== */}
        <div className="wizard-header">
          <AppHeader />
        </div>

        <FormProvider>
          <AutoSaveManager />

          {/* ================================================
              CARD 1 — APPLICATION PROGRESS
              FIXED
              ================================================ */}
          <section className="wizard-progress-card">
            <ProgressBar />

            <div className="wizard-step-indicator">
              <StepIndicator />
            </div>
          </section>

          {/* ================================================
              CARD 2 — LOAN APPLICATION FORM
              FIXED
              ================================================ */}
          <section className="wizard-form-card">
            {/* ==============================================
                ONLY SCROLLABLE AREA
                ============================================== */}
            <div className="wizard-form-scroll">
              <StepRenderer />
            </div>

            {/* ==============================================
                FIXED NAVIGATION
                ============================================== */}
            <div className="wizard-navigation">
              <NavigationButtons />
            </div>
          </section>
        </FormProvider>
      </PageContainer>
    </AppShell>
  );
}

export default WizardLayout;