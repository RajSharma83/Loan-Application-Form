import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Banknote,
  Calendar,
  CheckCircle2,
  CircleDollarSign,
  Gauge,
  Lock,
  ReceiptText,
  ShieldCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import MonthlyIncomeField from "./MonthlyIncomeField";
import ExistingEMIField from "./ExistingEMIField";
import OtherIncomeField from "./OtherIncomeField";
import MonthlyExpenseField from "./MonthlyExpenseField";

import CurrencyInput from "../../components/ui/Input/CurrencyInput";
import Select from "../../components/ui/Select";
import useFinancialCalculator from "../../hooks/useFinancialCalculator";
import { getInterestRate } from "../../constants/interestRates";
import { getLoanLimits } from "../../constants/loanLimits";
import "./Step6Financial.css";

function toNumber(value) {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/[^\d.]/g, "");

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value) {
  return `₹${Math.round(value || 0).toLocaleString("en-IN")}`;
}

function buildTenureOptions(loanType) {
  const limits = getLoanLimits(loanType);
  if (!limits) return [];

  const { minTenure, maxTenure } = limits;
  const step = maxTenure > 60 ? 12 : 6;

  const options = [];

  for (let months = minTenure; months <= maxTenure; months += step) {
    options.push(months);
  }

  if (options[options.length - 1] !== maxTenure) {
    options.push(maxTenure);
  }

  return options;
}

function tenureLabel(months) {
  const value = Number(months);
  if (!Number.isFinite(value) || value <= 0) return "—";

  const years = value / 12;

  if (value % 12 === 0) {
    return `${value} months (${years.toFixed(0)} ${
      years === 1 ? "year" : "years"
    })`;
  }

  return `${value} months (${years.toFixed(1)} years)`;
}

function getRiskState(dti) {
  if (dti > 40) {
    return {
      label: "High Risk",
      shortLabel: "High",
      color: "red",
      message:
        "Your debt burden is above the recommended level and may reduce borrowing capacity.",
    };
  }

  if (dti > 30) {
    return {
      label: "Moderate Risk",
      shortLabel: "Moderate",
      color: "amber",
      message:
        "Your debt burden is moderate. Keeping EMI commitments under control can improve affordability.",
    };
  }

  return {
    label: "Healthy",
    shortLabel: "Healthy",
    color: "green",
    message:
      "Your debt burden is currently within a healthy range.",
  };
}

function MetricCard({ icon: Icon, label, value, helper, tone = "indigo" }) {
  return (
    <div className={`financial-metric financial-metric-${tone}`}>
      <div className="financial-metric-icon">
        <Icon size={17} strokeWidth={2.2} />
      </div>

      <div className="financial-metric-copy">
        <p className="financial-metric-label">{label}</p>
        <p className="financial-metric-value">{value}</p>
        {helper && <p className="financial-metric-helper">{helper}</p>}
      </div>
    </div>
  );
}

function SectionHeading({ number, title, description }) {
  return (
    <div className="financial-section-heading">
      <div className="financial-section-number">{number}</div>

      <div className="financial-section-copy">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
    </div>
  );
}

function Step6Financial() {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const requestedLoanAmount = watch("requestedLoanAmount");
  // const loanTenure = watch("loanTenure");
  const interestRate = watch("interestRate");

  const stableLoanType = String(loanType ?? "");

  const {
    totalIncome,
    disposableIncome,
    existingEMI,
    proposedEMI,
    totalEMI,
    maximumNewEMI,
    maximumEligibleLoan,
    totalCostOfBorrowing,
    processingFee,
    dti,
    eligible,
  } = useFinancialCalculator();

  const fixedRate = getInterestRate(stableLoanType);
  const tenureOptions = useMemo(
    () => buildTenureOptions(stableLoanType),
    [stableLoanType]
  );

  /* Keep the Step 6 defaults tied to Step 1 exactly as before. */
  useEffect(() => {
    if (fixedRate !== null && fixedRate !== undefined) {
      setValue("interestRate", String(fixedRate), {
        shouldValidate: false,
      });
    }
  }, [fixedRate, setValue]);

  useEffect(() => {
    if (!getValues("requestedLoanAmount")) {
      const step1Amount = getValues("loanAmount");

      if (step1Amount) {
        setValue("requestedLoanAmount", step1Amount, {
          shouldValidate: false,
        });
      }
    }
    // Intentionally runs only when entering this step.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dtiValue = Math.max(0, dti || 0);
  const risk = getRiskState(dtiValue);

  const requestedAmount = toNumber(requestedLoanAmount);
  const maximumEligible = toNumber(maximumEligibleLoan);
  const affordableEmi = toNumber(maximumNewEMI);
  const proposedEmi = toNumber(proposedEMI);
  const remainingEmiCapacity = Math.max(
    0,
    affordableEmi - proposedEmi
  );

  const eligibilityDifference = Math.abs(
    maximumEligible - requestedAmount
  );

  const eligibilityPercent =
    maximumEligible > 0
      ? Math.min(
          100,
          (requestedAmount / maximumEligible) * 100
        )
      : 0;

  const dtiGaugePercent = Math.min(
    100,
    (dtiValue / 60) * 100
  );

  const totalOutflow = Math.max(
    0,
    totalIncome - disposableIncome
  );

  return (
    <div className="financial-step">
      {/* ======================================================
          HEADER
          ====================================================== */}
      <div className="financial-step-header">
        <div>
          <h2>Financial Details</h2>
          <p>
            Help us understand your monthly finances so we can
            estimate affordability and eligibility.
          </p>
        </div>
      </div>

      {/* ======================================================
          1. MONTHLY FINANCES
          ====================================================== */}
      <section className="financial-panel">
        <SectionHeading
          number="1"
          title="Your Monthly Finances"
          description="Enter your income, expenses and existing commitments."
        />

        <div className="financial-input-grid">
          <MonthlyIncomeField />
          <OtherIncomeField />
          <ExistingEMIField />
          <MonthlyExpenseField />
        </div>
      </section>

      {/* ======================================================
          2. FINANCIAL SNAPSHOT
          ====================================================== */}
      <section className="financial-panel">
        <SectionHeading
          number="2"
          title="Financial Snapshot"
          description="A quick view of your monthly cash flow."
        />

        <div className="financial-metrics-grid">
          <MetricCard
            icon={Banknote}
            label="Total Monthly Income"
            value={formatCurrency(totalIncome)}
            helper="All income sources"
            tone="indigo"
          />

          <MetricCard
            icon={ReceiptText}
            label="Monthly Outflow"
            value={formatCurrency(totalOutflow)}
            helper="EMI + expenses"
            tone="amber"
          />

          <MetricCard
            icon={WalletCards}
            label="Disposable Income"
            value={formatCurrency(disposableIncome)}
            helper="Available after commitments"
            tone="green"
          />

          <MetricCard
            icon={Gauge}
            label="Debt-to-Income Ratio"
            value={`${dtiValue.toFixed(2)}%`}
            helper={risk.label}
            tone={
              risk.color === "red"
                ? "red"
                : risk.color === "amber"
                ? "amber"
                : "green"
            }
          />
        </div>

        <div className="financial-dti-card">
          <div className="financial-dti-topline">
            <div>
              <p className="financial-dti-label">
                DTI (Debt-to-Income Ratio)
              </p>
              <p className="financial-dti-description">
                Total EMI commitments as a percentage of monthly income.
              </p>
            </div>

            <span className={`financial-risk-pill financial-risk-${risk.color}`}>
              {risk.shortLabel}
            </span>
          </div>

          <div className="financial-dti-gauge">
            <div className="financial-dti-track">
              <div
                className={`financial-dti-segment financial-dti-green ${
                  dtiValue > 30 ? "financial-dti-dim" : ""
                }`}
              />
              <div
                className={`financial-dti-segment financial-dti-amber ${
                  dtiValue <= 30 || dtiValue > 40
                    ? "financial-dti-dim"
                    : ""
                }`}
              />
              <div
                className={`financial-dti-segment financial-dti-red ${
                  dtiValue <= 40 ? "financial-dti-dim" : ""
                }`}
              />

              <div
                className="financial-dti-marker"
                style={{ left: `${dtiGaugePercent}%` }}
              />
            </div>

            <div className="financial-dti-scale">
              <span>0%</span>
              <span>30%</span>
              <span>40%</span>
              <span>60%+</span>
            </div>
          </div>

          <p className="financial-dti-message">{risk.message}</p>
        </div>
      </section>

      {/* ======================================================
          3. LOAN AFFORDABILITY
          ====================================================== */}
      <section className="financial-panel">
        <SectionHeading
          number="3"
          title="Loan Affordability"
          description="Review the loan amount, rate and tenure used for your affordability estimate."
        />

        <div className="financial-input-grid financial-input-grid-three">
          <CurrencyInput
            name="requestedLoanAmount"
            label="Requested Loan Amount"
            placeholder="Enter loan amount"
            required
            icon={CircleDollarSign}
          />

          <div className="financial-field">
            <label className="financial-field-label">
              <span className="financial-field-label-row">
                Interest Rate
                <Lock size={13} />
                <span className="financial-fixed-badge">Fixed</span>
              </span>
            </label>

            <div className="financial-fixed-input">
              {interestRate ? `${interestRate}%` : "—"}
            </div>

            <p className="financial-field-help">
              Applied automatically from your selected loan type.
            </p>
          </div>

          <Select
            label="Loan Tenure (Months)"
            required
            icon={Calendar}
            error={errors.loanTenure?.message}
            {...register("loanTenure")}
          >
            <option value="">Select tenure</option>

            {tenureOptions.map((months) => (
              <option key={months} value={months}>
                {tenureLabel(months)}
              </option>
            ))}
          </Select>
        </div>

        <div className="financial-result-grid">
          <MetricCard
            icon={Banknote}
            label="Estimated EMI"
            value={formatCurrency(proposedEmi)}
            helper="Monthly payment"
            tone="indigo"
          />

          <MetricCard
            icon={ReceiptText}
            label="Maximum Affordable EMI"
            value={formatCurrency(affordableEmi)}
            helper="Based on your profile"
            tone="green"
          />

          <MetricCard
            icon={TrendingUp}
            label="Maximum Eligible Loan"
            value={formatCurrency(maximumEligible)}
            helper="Estimated limit"
            tone="green"
          />

          <MetricCard
            icon={CircleDollarSign}
            label="Estimated Interest"
            value={formatCurrency(totalCostOfBorrowing)}
            helper="Over the selected tenure"
            tone="purple"
          />
        </div>

        <div className="financial-secondary-summary">
          <div>
            <span>Total Repayment</span>
            <strong>
              {formatCurrency(
                totalCostOfBorrowing + requestedAmount
              )}
            </strong>
          </div>

          <div>
            <span>Processing Fee</span>
            <strong>{formatCurrency(processingFee)}</strong>
          </div>
        </div>

        <div
          className={`financial-status-card ${
            requestedAmount > 0 && requestedAmount <= maximumEligible
              ? "financial-status-success"
              : "financial-status-warning"
          }`}
        >
          <div className="financial-status-icon">
            {requestedAmount > 0 && requestedAmount <= maximumEligible ? (
              <CheckCircle2 size={20} />
            ) : (
              <ShieldCheck size={20} />
            )}
          </div>

          <div>
            <h4>
              {requestedAmount === 0
                ? "Enter your requested loan amount"
                : requestedAmount <= maximumEligible
                ? "Requested amount is within your estimated eligibility"
                : "Requested amount exceeds your estimated eligibility"}
            </h4>

            <p>
              {requestedAmount === 0
                ? "We will compare your request with the estimated eligible amount."
                : requestedAmount <= maximumEligible
                ? `${formatCurrency(eligibilityDifference)} remains within your estimated eligible amount.`
                : `${formatCurrency(eligibilityDifference)} is above your estimated eligible amount.`}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================
          4. EMI AFFORDABILITY
          ====================================================== */}
      <section className="financial-panel">
        <SectionHeading
          number="4"
          title="EMI Affordability"
          description="See how your proposed EMI compares with your affordable monthly capacity."
        />

        <div className="financial-emi-layout">
          <div className="financial-emi-summary">
            <div>
              <span>Maximum Affordable EMI</span>
              <strong className="financial-value-green">
                {formatCurrency(affordableEmi)}
              </strong>
            </div>

            <div>
              <span>Existing EMI</span>
              <strong>{formatCurrency(existingEMI)}</strong>
            </div>

            <div>
              <span>Proposed EMI</span>
              <strong className="financial-value-indigo">
                {formatCurrency(proposedEmi)}
              </strong>
            </div>

            <div className="financial-emi-capacity">
              <span>Remaining EMI Capacity</span>
              <strong>{formatCurrency(remainingEmiCapacity)}</strong>
            </div>
          </div>

          <div className="financial-emi-bars">
            <div className="financial-bar-row">
              <div className="financial-bar-label">
                <span>Maximum Affordable EMI</span>
                <strong>{formatCurrency(affordableEmi)}</strong>
              </div>
              <div className="financial-bar-track">
                <div
                  className="financial-bar-fill financial-bar-green"
                  style={{
                    width: affordableEmi > 0 ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            <div className="financial-bar-row">
              <div className="financial-bar-label">
                <span>Existing EMI</span>
                <strong>{formatCurrency(existingEMI)}</strong>
              </div>
              <div className="financial-bar-track">
                <div
                  className="financial-bar-fill financial-bar-slate"
                  style={{
                    width:
                      affordableEmi > 0
                        ? `${Math.min(
                            100,
                            (existingEMI / affordableEmi) * 100
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div className="financial-bar-row">
              <div className="financial-bar-label">
                <span>Proposed EMI</span>
                <strong className="financial-value-indigo">
                  {formatCurrency(proposedEmi)}
                </strong>
              </div>
              <div className="financial-bar-track">
                <div
                  className={`financial-bar-fill ${
                    proposedEmi <= affordableEmi
                      ? "financial-bar-indigo"
                      : "financial-bar-red"
                  }`}
                  style={{
                    width:
                      affordableEmi > 0
                        ? `${Math.min(
                            100,
                            (proposedEmi / affordableEmi) * 100
                          )}%`
                        : "0%",
                  }}
                />
              </div>
            </div>

            <div
              className={`financial-compact-alert ${
                proposedEmi <= affordableEmi
                  ? "financial-alert-success"
                  : "financial-alert-danger"
              }`}
            >
              <CheckCircle2 size={18} />
              <div>
                <strong>
                  {proposedEmi <= affordableEmi
                    ? "Your proposed EMI is affordable"
                    : "Your proposed EMI is above the affordable limit"}
                </strong>
                <span>
                  {proposedEmi <= affordableEmi
                    ? `You have approximately ${formatCurrency(
                        remainingEmiCapacity
                      )} of additional EMI capacity.`
                    : `The proposed EMI is ${formatCurrency(
                        Math.abs(remainingEmiCapacity)
                      )} above the estimated affordable limit.`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          5. LOAN ELIGIBILITY CHECK
          ====================================================== */}
      <section className="financial-panel">
        <SectionHeading
          number="5"
          title="Loan Eligibility Check"
          description="Compare your requested amount with the estimated eligible limit."
        />

        <div className="financial-eligibility-layout">
          <div className="financial-eligibility-compare">
            <div className="financial-eligibility-values">
              <div>
                <span>Requested Loan</span>
                <strong className="financial-value-indigo">
                  {formatCurrency(requestedAmount)}
                </strong>
              </div>

              <div className="financial-eligibility-right">
                <span>Maximum Eligible Loan</span>
                <strong className="financial-value-green">
                  {formatCurrency(maximumEligible)}
                </strong>
              </div>
            </div>

            <div className="financial-eligibility-track">
              <div
                className="financial-eligibility-requested"
                style={{ width: `${eligibilityPercent}%` }}
              />

              <div
                className="financial-eligibility-marker"
                style={{ left: `${eligibilityPercent}%` }}
              />
            </div>

            <div className="financial-eligibility-scale">
              <span>₹0</span>
              <span>{formatCurrency(requestedAmount)}</span>
              <span>{formatCurrency(maximumEligible)}</span>
            </div>
          </div>

          <div
            className={`financial-final-status ${
              eligible
                ? "financial-final-status-success"
                : "financial-final-status-danger"
            }`}
          >
            <div className="financial-final-status-icon">
              {eligible ? (
                <CheckCircle2 size={22} />
              ) : (
                <ShieldCheck size={22} />
              )}
            </div>

            <div>
              <span className="financial-final-status-label">
                {eligible ? "Estimated Eligible" : "Needs Review"}
              </span>

              <h4>
                {eligible
                  ? "Your requested loan is within the estimated eligibility limit."
                  : "Your requested loan is above the current affordability estimate."}
              </h4>

              <p>
                {eligible
                  ? "You can continue to the next step based on the financial information provided."
                  : "Consider reducing the requested amount or reviewing your financial commitments before continuing."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden live-value preservation for React Hook Form */}
      <input
        type="hidden"
        value={totalEMI}
        readOnly
        aria-hidden="true"
      />
    </div>
  );
}

export default Step6Financial;