import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileClock,
  FileText,
  Home,
  LockKeyhole,
  Play,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
  Clock3,
} from "lucide-react";

import useWizardStore from "../../store/wizardStore";
import {
  loadValidDraft,
  clearDraft,
} from "../../utils/draftStorage";

import steps from "../../constants/steps";
import { getVisibleSteps } from "../../utils/visibleSteps";

import AppShell from "../../layouts/AppShell";
import PageContainer from "../../layouts/PageContainer";
import Spinner from "../../components/ui/Spinner";

import "./ResumePage.css";

/* ============================================================
   HELPERS
   ============================================================ */

function formatCurrency(value) {
  const numeric = Number(
    String(value ?? "").replace(/\D/g, "")
  );

  if (!Number.isFinite(numeric) || numeric <= 0) {
    return "—";
  }

  return `₹${numeric.toLocaleString("en-IN")}`;
}

function tenureLabel(months) {
  const value = Number(months);

  if (!Number.isFinite(value) || value <= 0) {
    return "—";
  }

  if (value % 12 === 0) {
    const years = value / 12;

    return `${value} Months (${years} ${
      years === 1 ? "Year" : "Years"
    })`;
  }

  return `${value} Months`;
}

function loanLabel(loanType) {
  const labels = {
    personal: "Personal Loan",
    home: "Home Loan",
    business: "Business Loan",
  };

  return labels[loanType] ?? "Loan Application";
}

/* ============================================================
   PAGE
   ============================================================ */

function ResumePage() {
  const navigate = useNavigate();

  /* ==========================================================
     ZUSTAND
     ========================================================== */

  const hydrateFromDraft = useWizardStore(
    (state) => state.hydrateFromDraft
  );

  const setDraftChecked = useWizardStore(
    (state) => state.setDraftChecked
  );

  const resetForm = useWizardStore(
    (state) => state.resetForm
  );

  /* ==========================================================
     LOCAL STATE
     ========================================================== */

  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);

  /* ==========================================================
     LOAD DRAFT
     ========================================================== */

  useEffect(() => {
    let isMounted = true;

    loadValidDraft().then((found) => {
      if (!isMounted) {
        return;
      }

      if (!found) {
        setDraftChecked(true);

        navigate("/", {
          replace: true,
        });

        return;
      }

      setDraft(found);
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [navigate, setDraftChecked]);

  /* ==========================================================
     ACTIONS
     ========================================================== */

  const handleResume = () => {
    if (!draft) {
      return;
    }

    hydrateFromDraft(draft);

    navigate("/", {
      replace: true,
    });
  };

  const handleStartFresh = () => {
    clearDraft();
    resetForm();
    setDraftChecked(true);

    navigate("/", {
      replace: true,
    });
  };

  /* ==========================================================
     DERIVED DATA

     IMPORTANT:
     These hooks MUST run on EVERY render.
     They must NOT be placed below the loading return.
     ========================================================== */

  const formData = draft?.formData ?? {};

  const visibleSteps = useMemo(() => {
    return getVisibleSteps(formData);
  }, [formData]);

  const currentStepIndex = useMemo(() => {
    const index = visibleSteps.findIndex(
      (step) => step.id === draft?.currentStep
    );

    return Math.max(0, index);
  }, [visibleSteps, draft?.currentStep]);

  const visibleCurrentStepNumber =
    currentStepIndex + 1;

  const totalVisibleSteps =
    visibleSteps.length;

  const progressPercent =
    totalVisibleSteps > 0
      ? Math.round(
          (visibleCurrentStepNumber /
            totalVisibleSteps) *
            100
        )
      : 0;

  const currentStep =
    visibleSteps[currentStepIndex] ??
    steps.find(
      (step) => step.id === draft?.currentStep
    );

  const nextStep =
    currentStepIndex >= 0 &&
    currentStepIndex <
      visibleSteps.length - 1
      ? visibleSteps[
          currentStepIndex + 1
        ]
      : null;

  const firstName = String(
    formData.firstName ?? ""
  ).trim();

  const welcomeTitle = firstName
    ? `Welcome back, ${firstName}!`
    : "Welcome back!";

  const savedAt = draft?.timestamp
    ? dayjs(draft.timestamp).format(
        "MMM D, YYYY · h:mm A"
      )
    : "—";

  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <AppShell>
        <PageContainer>
          <div className="resume-loading">
            <Spinner />
          </div>
        </PageContainer>
      </AppShell>
    );
  }

  /* ==========================================================
     PAGE UI
     ========================================================== */

  return (
    <AppShell>
      <PageContainer>
        <div className="resume-page">
          {/* ==================================================
              TOP BAR
              ================================================== */}

          <header className="resume-topbar">
            <div className="resume-topbar-spacer" />

            <div className="resume-topbar-actions">
              <button
                type="button"
                className="resume-icon-button"
                aria-label="Notifications"
              >
                <span className="resume-notification-dot">
                  2
                </span>

                <Clock3 size={19} />
              </button>

              <div className="resume-profile-chip">
                <div className="resume-profile-avatar">
                  {firstName
                    ? firstName
                        .charAt(0)
                        .toUpperCase()
                    : "U"}
                </div>

                <div className="resume-profile-copy">
                  <strong>
                    {firstName || "Applicant"}
                  </strong>

                  <span>
                    Loan Applicant
                  </span>
                </div>

                <ArrowRight
                  size={16}
                  className="resume-profile-arrow"
                />
              </div>
            </div>
          </header>

          {/* ==================================================
              HERO
              ================================================== */}

          <section className="resume-hero-card">
            <div className="resume-hero-content">
              <div className="resume-hero-eyebrow">
                <Sparkles size={15} />

                <span>
                  Your application is waiting
                </span>
              </div>

              <h1>
                {welcomeTitle}
              </h1>

              <p className="resume-hero-description">
                We found an in-progress{" "}
                {loanLabel(
                  formData.loanType
                )}
                . Your information is
                safely saved on this device,
                so you can continue without
                starting over.
              </p>

              <div className="resume-hero-meta">
                <span>
                  <Clock3 size={15} />

                  Last saved {savedAt}
                </span>

                <span>
                  Step{" "}
                  {visibleCurrentStepNumber}{" "}
                  of {totalVisibleSteps}

                  {currentStep?.title
                    ? ` — ${currentStep.title}`
                    : ""}
                </span>
              </div>

              <div className="resume-hero-actions">
                <button
                  type="button"
                  onClick={handleResume}
                  className="resume-primary-button"
                >
                  <span className="resume-button-icon">
                    <Play
                      size={16}
                      fill="currentColor"
                    />
                  </span>

                  Resume Application

                  <ArrowRight size={18} />
                </button>

                <button
                  type="button"
                  onClick={handleStartFresh}
                  className="resume-secondary-button"
                >
                  <RefreshCcw size={17} />

                  Start Fresh
                </button>
              </div>

              <div className="resume-draft-note">
                <ShieldCheck size={16} />

                <span>
                  Drafts are encrypted on this
                  device and automatically
                  expire after 72 hours.
                </span>
              </div>
            </div>

            <div
              className="resume-hero-visual"
              aria-hidden="true"
            >
              <div className="resume-hero-glow" />

              <div className="resume-hero-building">
                <Home
                  size={66}
                  strokeWidth={1.6}
                />
              </div>

              <div className="resume-hero-clipboard">
                <ClipboardList
                  size={76}
                  strokeWidth={1.7}
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              PROGRESS
              ================================================== */}

          <section className="resume-progress-card">
            <div className="resume-section-topline">
              <div>
                <p className="resume-section-kicker">
                  Application Progress
                </p>

                <h2>
                  Step{" "}
                  {visibleCurrentStepNumber}{" "}
                  of {totalVisibleSteps}
                </h2>
              </div>

              <span className="resume-progress-pill">
                {progressPercent}% Complete
              </span>
            </div>

            <div className="resume-progress-track">
              {visibleSteps.map(
                (step, index) => {
                  const completed =
                    index <
                    currentStepIndex;

                  const active =
                    index ===
                    currentStepIndex;

                  return (
                    <div
                      key={step.id}
                      className="resume-progress-step"
                    >
                      <div className="resume-progress-node-row">
                        <div
                          className={`resume-progress-node ${
                            completed
                              ? "is-complete"
                              : active
                              ? "is-active"
                              : ""
                          }`}
                        >
                          {completed ? (
                            <CheckCircle2
                              size={15}
                            />
                          ) : (
                            index + 1
                          )}
                        </div>

                        {index <
                          visibleSteps.length -
                            1 && (
                          <div
                            className={`resume-progress-connector ${
                              completed
                                ? "is-complete"
                                : ""
                            }`}
                          />
                        )}
                      </div>

                      <span
                        className={`resume-progress-label ${
                          active
                            ? "is-active"
                            : ""
                        }`}
                      >
                        {step.title}
                      </span>
                    </div>
                  );
                }
              )}
            </div>
          </section>

          {/* ==================================================
              MAIN CONTENT
              ================================================== */}

          <div className="resume-content-grid">
            <main className="resume-main-column">
              {/* Draft summary */}

              <section className="resume-draft-card">
                <div className="resume-card-header">
                  <div className="resume-card-title-wrap">
                    <div className="resume-card-icon resume-card-icon-purple">
                      <FileText size={20} />
                    </div>

                    <div>
                      <h2>
                        Your Draft Application
                      </h2>

                      <p>
                        Last saved {savedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResume}
                    className="resume-view-button"
                  >
                    <Eye size={15} />

                    View Details
                  </button>
                </div>

                <div className="resume-draft-grid">
                  {/* LEFT */}

                  <div className="resume-detail-column">
                    <div className="resume-detail-row">
                      <span>
                        Loan Type
                      </span>

                      <strong>
                        {loanLabel(
                          formData.loanType
                        )}
                      </strong>
                    </div>

                    <div className="resume-detail-row">
                      <span>
                        Requested Amount
                      </span>

                      <strong>
                        {formatCurrency(
                          formData.loanAmount
                        )}
                      </strong>
                    </div>

                    <div className="resume-detail-row">
                      <span>
                        Interest Rate
                      </span>

                      <strong>
                        {formData.interestRate
                          ? `${formData.interestRate}% (Fixed)`
                          : "Based on loan type"}
                      </strong>
                    </div>

                    <div className="resume-detail-row">
                      <span>
                        Tenure
                      </span>

                      <strong>
                        {tenureLabel(
                          formData.loanTenure
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* RIGHT */}

                  <div className="resume-detail-column resume-detail-column-right">
                    <div className="resume-detail-row">
                      <span>
                        Next Step
                      </span>

                      <strong>
                        {nextStep?.title ??
                          "Review & Submit"}
                      </strong>
                    </div>

                    <div className="resume-detail-row">
                      <span>
                        Progress
                      </span>

                      <strong>
                        {progressPercent}% Complete
                      </strong>
                    </div>

                    <div className="resume-detail-row">
                      <span>
                        Saved
                      </span>

                      <strong>
                        {savedAt}
                      </strong>
                    </div>

                    <div className="resume-detail-row">
                      <span>
                        Status
                      </span>

                      <span className="resume-status-badge">
                        In Progress
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Security */}

              <section className="resume-security-card">
                <div className="resume-security-icon">
                  <ShieldCheck size={24} />
                </div>

                <div className="resume-security-copy">
                  <h3>
                    Your information is safe
                    with us
                  </h3>

                  <p>
                    Your saved application stays
                    on this device and is protected
                    throughout the application
                    journey.
                  </p>
                </div>

                <div className="resume-security-items">
                  <span>
                    <LockKeyhole
                      size={15}
                    />
                    Secure storage
                  </span>

                  <span>
                    <ShieldCheck
                      size={15}
                    />
                    Privacy protected
                  </span>

                  <span>
                    <CheckCircle2
                      size={15}
                    />
                    Auto expires
                  </span>
                </div>
              </section>
            </main>

            {/* ==================================================
                RIGHT COLUMN
                ================================================== */}

            <aside className="resume-side-column">
              {/* Benefits */}

              <section className="resume-benefits-card">
                <div className="resume-side-heading">
                  <h2>
                    Why complete your
                    application?
                  </h2>

                  <p>
                    Finish your details to move
                    smoothly through verification
                    and loan processing.
                  </p>
                </div>

                <div className="resume-benefit-list">
                  <div className="resume-benefit-item">
                    <div className="resume-benefit-icon resume-benefit-green">
                      <TrendingUp
                        size={18}
                      />
                    </div>

                    <div>
                      <h3>
                        Faster Approvals
                      </h3>

                      <p>
                        Complete information helps
                        speed up verification and
                        review.
                      </p>
                    </div>
                  </div>

                  <div className="resume-benefit-item">
                    <div className="resume-benefit-icon resume-benefit-purple">
                      <WalletCards
                        size={18}
                      />
                    </div>

                    <div>
                      <h3>
                        Better Offers
                      </h3>

                      <p>
                        Accurate details help us
                        calculate the right loan and
                        repayment options.
                      </p>
                    </div>
                  </div>

                  <div className="resume-benefit-item">
                    <div className="resume-benefit-icon resume-benefit-orange">
                      <ShieldCheck
                        size={18}
                      />
                    </div>

                    <div>
                      <h3>
                        100% Secure
                      </h3>

                      <p>
                        Your information stays
                        protected throughout the
                        process.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Help */}

              <section className="resume-help-card">
                <div className="resume-help-header">
                  <div className="resume-help-icon">
                    <FileClock size={18} />
                  </div>

                  <div>
                    <h2>
                      Need help?
                    </h2>

                    <p>
                      Our support team can help
                      you continue your
                      application.
                    </p>
                  </div>
                </div>

                <a
                  href="mailto:support@lendswift.example"
                  className="resume-help-button"
                >
                  Contact Support
                </a>
              </section>
            </aside>
          </div>
        </div>
      </PageContainer>
    </AppShell>
  );
}

export default ResumePage;