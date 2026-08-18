import { useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Pencil,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  WalletCards,
} from "lucide-react";

import reviewConfig from "./reviewConfig";
import ReviewSection from "./ReviewSection";
import ComplianceDisclosures from "./ComplianceDisclosures";
import KeyFactStatement from "./KeyFactStatement";
import useWizardStore from "../../store/wizardStore";
import useFinancialCalculator from "../../hooks/useFinancialCalculator";
import { clearDraft } from "../../utils/draftStorage";
import { getVisibleSteps } from "../../utils/visibleSteps";
import getDocumentConfig from "../Step7Documents/documentConfig";
import "./Step8Review.css";

function toNumber(value) {
  return Number(String(value ?? "").replace(/[^\d.]/g, "")) || 0;
}

function formatCurrency(value) {
  return `₹${Math.round(Number(value) || 0).toLocaleString("en-IN")}`;
}

function Step8Review() {
  const {
    handleSubmit,
    formState: { errors },
    register,
    watch,
    getValues,
  } = useFormContext();

  const navigate = useNavigate();
  const resetForm = useWizardStore((state) => state.resetForm);
  const goToStep = useWizardStore((state) => state.goToStep);
  const panVerified = useWizardStore((state) => state.panVerified);
  const aadhaarVerified = useWizardStore((state) => state.aadhaarVerified);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loanType = watch("loanType");
  const loanAmount = watch("loanAmount");
  const loanTenure = watch("loanTenure");
  const interestRate = watch("interestRate");
  const signature = watch("signature");
  const employmentType = watch("employmentType");
  const coApplicantMonthlyIncome = watch("coApplicantMonthlyIncome");
  const monthlyIncome = watch("monthlyIncome");
  const monthlyExpenses = watch("monthlyExpenses");
  const existingEMI = watch("existingEMI");

  const { proposedEMI, totalIncome } = useFinancialCalculator();

  const values = getValues();

  const visibleSteps = useMemo(
    () => getVisibleSteps({ loanType, loanAmount }),
    [loanType, loanAmount]
  );

  const visibleStepIds = useMemo(
    () => new Set(visibleSteps.map((step) => step.id)),
    [visibleSteps]
  );

  const visibleReviewConfig = useMemo(
    () =>
      reviewConfig.filter(
        (section) =>
          visibleStepIds.has(section.step) && section.step !== 8
      ),
    [visibleStepIds]
  );

  const combinedIncome =
    totalIncome +
    (visibleStepIds.has(6)
      ? toNumber(coApplicantMonthlyIncome)
      : 0);

  const emiToIncomeRatio =
    combinedIncome > 0
      ? (toNumber(proposedEMI) / combinedIncome) * 100
      : 0;

  const emiRatioExceedsLimit = emiToIncomeRatio > 50;

  const documentConfig = useMemo(
    () =>
      getDocumentConfig({
        loanType,
        employmentType,
        panVerified,
      }),
    [loanType, employmentType, panVerified]
  );

  const uploadedDocuments = documentConfig.filter((document) =>
    Boolean(values[document.name])
  );

  const requiredDocuments = documentConfig.filter(
    (document) => document.required
  );

  const uploadedRequiredDocuments = requiredDocuments.filter(
    (document) => Boolean(values[document.name])
  );

  const completedSections = visibleReviewConfig.reduce(
    (count, section) => {
      const populated = section.fields.filter((field) => {
        const value = values[field.key];
        return value !== undefined && value !== null && value !== "";
      }).length;

      return populated / Math.max(section.fields.length, 1) >= 0.5
        ? count + 1
        : count;
    },
    0
  );

  const baseSections = Math.max(
    visibleReviewConfig.length,
    1
  );

  const sectionScore = completedSections / baseSections;
  const documentScore = requiredDocuments.length
    ? uploadedRequiredDocuments.length / requiredDocuments.length
    : 1;
  const verificationScore =
    panVerified || aadhaarVerified ? 1 : 0;
  const signatureScore = signature ? 1 : 0;

  const readinessPercent = Math.round(
    Math.min(
      100,
      (sectionScore * 0.65 +
        documentScore * 0.2 +
        verificationScore * 0.1 +
        signatureScore * 0.05) *
        100
    )
  );

  const readinessItems = [
    {
      done: completedSections === baseSections,
      label: "All required details provided",
    },
    {
      done: panVerified || aadhaarVerified,
      label: "KYC verification completed",
    },
    {
      done:
        Boolean(
          values.employmentType ||
            values.companyName ||
            values.businessName ||
            values.collegeName
        ),
      label: "Employment details available",
    },
    {
      done:
        toNumber(monthlyIncome) > 0 ||
        toNumber(totalIncome) > 0,
      label: "Financial information provided",
    },
    {
      done:
        requiredDocuments.length ===
        uploadedRequiredDocuments.length,
      label: "Required documents uploaded",
    },
  ];

  const CO_APPLICANT_FIELDS = [
    "coApplicantRelationship",
    "coApplicantFirstName",
    "coApplicantLastName",
    "coApplicantDob",
    "coApplicantMobile",
    "coApplicantEmail",
    "coApplicantPan",
    "coApplicantMonthlyIncome",
    "coApplicantConsent",
  ];

  const onSubmit = (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const payload = { ...data };

    if (!visibleStepIds.has(6)) {
      CO_APPLICANT_FIELDS.forEach((field) => {
        delete payload[field];
      });
    }

    // Existing project uses a local scaffold instead of a backend POST.
    void payload;

    clearDraft();
    resetForm();
    navigate("/success");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="review-page"
    >
      {/* ==================================================
          PAGE HEADER
          ================================================== */}
      <div className="review-page-header">
        <div className="review-page-title-wrap">
          <div className="review-page-icon">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2>Review &amp; Submit</h2>
            <p>
              Review all the information you have provided before
              submitting your application.
            </p>
          </div>
        </div>

        <div className="review-ready-chip">
          <Sparkles size={15} />
          {readinessPercent}% ready
        </div>
      </div>

      <div className="review-layout">
        {/* ==================================================
            LEFT COLUMN
            ================================================== */}
        <div className="review-main-column">
          {visibleReviewConfig.map((section) => (
            <ReviewSection
              key={`${section.step}-${section.title}`}
              {...section}
              values={values}
              onEdit={goToStep}
            />
          ))}

          {/* Financial Summary */}
          <section className="review-summary-card">
            <div className="review-card-header">
              <div className="review-card-title-wrap">
                <div className="review-card-icon review-card-icon-green">
                  <WalletCards size={19} />
                </div>

                <div>
                  <h3>Financial Summary</h3>
                  <p>Latest affordability and income snapshot.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToStep(7)}
                className="review-edit-button"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            <div className="review-financial-grid">
              <div>
                <span>Total Monthly Income</span>
                <strong className="review-value-green">
                  {formatCurrency(totalIncome)}
                </strong>
              </div>

              <div>
                <span>Monthly Outflow</span>
                <strong className="review-value-amber">
                  {formatCurrency(
                    toNumber(monthlyExpenses) +
                      toNumber(existingEMI)
                  )}
                </strong>
              </div>

              <div>
                <span>Disposable Income</span>
                <strong className="review-value-green">
                  {formatCurrency(
                    Math.max(
                      0,
                      toNumber(totalIncome) -
                        toNumber(monthlyExpenses) -
                        toNumber(existingEMI)
                    )
                  )}
                </strong>
              </div>

              <div>
                <span>Estimated EMI</span>
                <strong className="review-value-indigo">
                  {formatCurrency(proposedEMI)}
                </strong>
              </div>
            </div>
          </section>

          {/* Loan cost summary */}
          <KeyFactStatement
            loanAmount={loanAmount}
            loanTenure={loanTenure}
            interestRate={interestRate}
          />

          {/* Documents */}
          <section className="review-summary-card">
            <div className="review-card-header">
              <div className="review-card-title-wrap">
                <div className="review-card-icon review-card-icon-blue">
                  <UploadCloud size={19} />
                </div>

                <div>
                  <h3>Documents Uploaded</h3>
                  <p>
                    {uploadedDocuments.length} of {documentConfig.length}{" "}
                    documents uploaded.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToStep(8)}
                className="review-edit-button"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            <div className="review-document-grid">
              {documentConfig.map((document) => {
                const uploaded = Boolean(values[document.name]);

                return (
                  <div
                    key={document.name}
                    className={`review-document-chip ${
                      uploaded
                        ? "review-document-uploaded"
                        : ""
                    }`}
                  >
                    <div className="review-document-chip-icon">
                      {uploaded ? (
                        <CheckCircle2 size={15} />
                      ) : (
                        <UploadCloud size={15} />
                      )}
                    </div>

                    <div>
                      <strong>{document.title}</strong>
                      <span>
                        {uploaded
                          ? "Uploaded"
                          : document.required
                          ? "Required"
                          : "Optional"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Signature */}
          <section className="review-summary-card">
            <div className="review-card-header">
              <div className="review-card-title-wrap">
                <div className="review-card-icon review-card-icon-indigo">
                  <FileCheck2 size={19} />
                </div>

                <div>
                  <h3>Electronic Signature</h3>
                  <p>Your signature will be attached to the application.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => goToStep(8)}
                className="review-edit-button"
              >
                <Pencil size={14} />
                Edit
              </button>
            </div>

            {signature ? (
              <div className="review-signature-area">
                <img
                  src={signature}
                  alt="Applicant signature"
                  className="review-signature-image"
                />
              </div>
            ) : (
              <div className="review-empty-state">
                <FileCheck2 size={18} />
                No signature provided yet.
              </div>
            )}
          </section>

          {/* Compliance */}
          <div className="review-compliance-wrap">
            <ComplianceDisclosures />
          </div>

          {/* High EMI acknowledgment */}
          {emiRatioExceedsLimit && (
            <div className="review-warning-card">
              <div className="review-warning-icon">
                <AlertTriangle size={20} />
              </div>

              <div>
                <h3>High EMI-to-Income Ratio</h3>

                <p>
                  Your estimated EMI is{" "}
                  <strong>
                    {emiToIncomeRatio.toFixed(0)}%
                  </strong>{" "}
                  of your{" "}
                  {visibleStepIds.has(6)
                    ? "combined"
                    : "monthly"} income. You may still proceed, but please
                  confirm that you understand this before submitting.
                </p>

                <ConsentCheckbox
                  name="highEmiAcknowledgment"
                  register={register}
                  error={errors.highEmiAcknowledgment}
                  label="I understand my EMI exceeds 50% of my income and I wish to proceed with this application anyway."
                />
              </div>
            </div>
          )}

          {/* Final consents */}
          <section className="review-consent-card">
            <div className="review-consent-header">
              <div className="review-card-icon review-card-icon-indigo">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h3>Final Confirmation</h3>
                <p>
                  Please confirm the following before submitting your
                  application.
                </p>
              </div>
            </div>

            <div className="review-consent-list">
              <ConsentCheckbox
                name="confirmAccuracy"
                register={register}
                error={errors.confirmAccuracy}
                label="I confirm that all the information provided in this application is accurate to the best of my knowledge."
              />

              <ConsentCheckbox
                name="consentCreditCheck"
                register={register}
                error={errors.consentCreditCheck}
                label="I authorise LendSwift to check my credit score and credit history via CIBIL/Equifax."
              />

              <ConsentCheckbox
                name="agreeTerms"
                register={register}
                error={errors.agreeTerms}
                label={
                  <>
                    I agree to the{" "}
                    <a
                      href="/terms.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                    >
                      Terms and Conditions
                    </a>
                    .
                  </>
                }
              />

              <ConsentCheckbox
                name="consentCommunications"
                register={register}
                error={errors.consentCommunications}
                label="I consent to receive communications (email, SMS, calls) regarding this application."
              />
            </div>
          </section>

          <div className="review-final-notice">
            <Clock3 size={18} />
            <div>
              <strong>Please Review Carefully</strong>
              <p>
                Make sure the information and documents above are correct.
                You can edit any section before submitting.
              </p>
            </div>
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN — READINESS
            ================================================== */}
        <aside className="review-side-column">
          <div className="review-readiness-card">
            <div className="review-side-title">
              <h3>Application Readiness</h3>
              <span>{readinessPercent}%</span>
            </div>

            <div
              className="review-readiness-ring"
              style={{
                "--readiness": `${readinessPercent}%`,
              }}
            >
              <div>
                <strong>{readinessPercent}%</strong>
                <span>Complete</span>
              </div>
            </div>

            <p className="review-readiness-message">
              {readinessPercent >= 90
                ? "Excellent! Your application is almost ready to submit."
                : "Complete the remaining items before submitting your application."}
            </p>

            <div className="review-readiness-list">
              {readinessItems.map((item) => (
                <div
                  key={item.label}
                  className="review-readiness-item"
                >
                  {item.done ? (
                    <CheckCircle2
                      size={16}
                      className="review-check-icon"
                    />
                  ) : (
                    <span className="review-open-circle" />
                  )}
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="review-next-card">
            <h3>What happens next?</h3>

            <div className="review-timeline">
              <TimelineItem
                number="1"
                title="Submit Application"
                text="Your application will be submitted securely."
              />

              <TimelineItem
                number="2"
                title="Verification Process"
                text="Our team will review your details and documents."
              />

              <TimelineItem
                number="3"
                title="Final Decision"
                text="You will receive an update after verification."
              />

              <TimelineItem
                number="4"
                title="Disbursement"
                text="Once approved, the loan amount can be disbursed according to the final terms."
                last
              />
            </div>
          </div>

          <div className="review-security-card">
            <div className="review-security-icon">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h3>Secure &amp; Safe</h3>
              <p>
                Your application information is protected and handled
                securely throughout the review process.
              </p>
            </div>
          </div>

          {/* Desktop action buttons */}
          <div className="review-side-actions">
            <button
              type="button"
              onClick={() => goToStep(visibleSteps.at(-2)?.id ?? 7)}
              className="review-back-button"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              className="review-submit-button"
            >
              {isSubmitting
                ? "Submitting..."
                : "Submit Application"}
              <span>→</span>
            </button>
          </div>
        </aside>
      </div>
    </form>
  );
}

function TimelineItem({ number, title, text, last = false }) {
  return (
    <div className={`review-timeline-item ${last ? "last" : ""}`}>
      <div className="review-timeline-number">{number}</div>

      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  );
}

function ConsentCheckbox({ name, register, error, label }) {
  return (
    <div
      className={`review-consent-row ${
        error ? "review-consent-error" : ""
      }`}
    >
      <label>
        <input
          type="checkbox"
          {...register(name, {
            required:
              "This consent is required to submit your application.",
          })}
          className="review-checkbox"
        />

        <span>
          {label}
        </span>
      </label>

      {error && (
        <p className="review-consent-error-message">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default Step8Review;
