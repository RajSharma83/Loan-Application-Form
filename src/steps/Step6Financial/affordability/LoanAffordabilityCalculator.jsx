import { useEffect, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Lock } from "lucide-react";

import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { getInterestRate } from "../../../constants/interestRates";

function formatCurrency(value) {
  if (!value) return "₹0";

  return `₹${new Intl.NumberFormat("en-IN").format(
    Math.round(value)
  )}`;
}

function LoanAffordabilityCalculator() {
  const {
    register,
    control,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const fixedRate = getInterestRate(loanType);

  // Interest rate is FIXED by loan type for this simulation (JD
  // Section C3.3) — never user-editable. Kept in sync (not just a
  // one-time prefill like requestedLoanAmount below) so it's always
  // correct even if the user goes back to Step 1 and changes the
  // loan type after already visiting this step.
  useEffect(() => {
    if (fixedRate !== null) {
      setValue("interestRate", String(fixedRate), {
        shouldValidate: false,
      });
    }
  }, [fixedRate, setValue]);

  // Cross-step dependency: default the requested amount to what was
  // entered in Step 1, rather than leaving the user to re-type it (and
  // risk it silently diverging from the amount that determined whether
  // a Co-Applicant was required).
  useEffect(() => {
    if (!getValues("requestedLoanAmount")) {
      const step1Amount = getValues("loanAmount");
      if (step1Amount) {
        setValue("requestedLoanAmount", step1Amount, {
          shouldValidate: false,
        });
      }
    }
    // Only ever runs once, on entering this step — after that the
    // field is the user's own edit and must not be overwritten.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const monthlyIncome = Number(
    String(watch("monthlyIncome") || "").replace(/\D/g, "")
  );

  const otherIncome = Number(
    String(watch("otherIncome") || "").replace(/\D/g, "")
  );

  const existingEMI = Number(
    String(watch("existingEMI") || "").replace(/\D/g, "")
  );

  const monthlyExpenses = Number(
    String(watch("monthlyExpenses") || "").replace(/\D/g, "")
  );

  const loanAmount = Number(
    String(watch("requestedLoanAmount") || "").replace(/\D/g, "")
  );

  const interestRate = Number(
    watch("interestRate") || 0
  );

  const tenureYears = Number(
    watch("loanTenure") || 0
  );

  const calculations = useMemo(() => {
    const totalIncome =
      monthlyIncome + otherIncome;

    const disposableIncome =
      totalIncome -
      existingEMI -
      monthlyExpenses;

    /*
     * Maximum total EMI allowed:
     * 40% of total monthly income.
     */

    const maximumTotalEMI =
      totalIncome * 0.4;

    /*
     * Existing EMI already consumes part
     * of the allowed EMI capacity.
     */

    const maximumNewEMI = Math.max(
      0,
      maximumTotalEMI - existingEMI
    );

    /*
     * EMI calculation
     */

    const monthlyRate =
      interestRate / 12 / 100;

    const numberOfPayments =
      tenureYears * 12;

    let estimatedEMI = 0;

    if (
      loanAmount > 0 &&
      monthlyRate > 0 &&
      numberOfPayments > 0
    ) {
      estimatedEMI =
        (loanAmount *
          monthlyRate *
          Math.pow(
            1 + monthlyRate,
            numberOfPayments
          )) /
        (Math.pow(
          1 + monthlyRate,
          numberOfPayments
        ) - 1);
    }

    /*
     * Maximum eligible loan based on
     * maximum affordable EMI.
     */

    let maximumEligibleLoan = 0;

    if (
      maximumNewEMI > 0 &&
      monthlyRate > 0 &&
      numberOfPayments > 0
    ) {
      maximumEligibleLoan =
        (maximumNewEMI *
          (Math.pow(
            1 + monthlyRate,
            numberOfPayments
          ) - 1)) /
        (monthlyRate *
          Math.pow(
            1 + monthlyRate,
            numberOfPayments
          ));
    }

    /*
     * Total repayment
     */

    const totalRepayment =
      estimatedEMI * numberOfPayments;

    /*
     * Total interest
     */

    const estimatedInterest = Math.max(
      0,
      totalRepayment - loanAmount
    );

    /*
     * Requested loan status
     */

    const exceedsEligibility =
      loanAmount > maximumEligibleLoan;

    return {
      totalIncome,
      disposableIncome,
      maximumNewEMI,
      estimatedEMI,
      maximumEligibleLoan,
      totalRepayment,
      estimatedInterest,
      exceedsEligibility,
    };
  }, [
    monthlyIncome,
    otherIncome,
    existingEMI,
    monthlyExpenses,
    loanAmount,
    interestRate,
    tenureYears,
  ]);

  return (
    <section className="neu-surface rounded-2xl bg-white p-6">
      {/* Header */}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Loan Affordability Calculator
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Estimate your monthly EMI and affordable loan
          amount based on the financial information provided.
        </p>
      </div>

      {/* Inputs */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Requested Loan Amount */}

        <Controller
          name="requestedLoanAmount"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              value={
                field.value
                  ? new Intl.NumberFormat("en-IN").format(
                      Number(
                        String(field.value).replace(/,/g, "")
                      )
                    )
                  : ""
              }
              label="Requested Loan Amount"
              required
              type="text"
              inputMode="numeric"
              placeholder="Enter loan amount"
              error={
                errors.requestedLoanAmount?.message
              }
              onChange={(e) => {
                const rawValue =
                  e.target.value.replace(/,/g, "");

                /*
                 * Allow only numbers.
                 */

                if (!/^\d*$/.test(rawValue)) {
                  return;
                }

                /*
                 * Store raw numeric value
                 * without commas.
                 */

                field.onChange(rawValue);
              }}
            />
          )}
        />

        {/* Interest Rate — fixed by loan type, not user-editable */}

        <div className="space-y-2">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            Interest Rate (%)
            <Lock size={13} className="text-slate-400" />
          </label>

          <input
            type="text"
            readOnly
            tabIndex={-1}
            {...register("interestRate")}
            className="neu-inset-shadow w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-3 text-slate-600 outline-none"
          />

          <p className="text-xs text-slate-400">
            Fixed rate for this loan type, applied automatically.
          </p>
        </div>

        {/* Loan Tenure */}

        <Select
          label="Loan Tenure"
          required
          error={errors.loanTenure?.message}
          {...register("loanTenure")}
        >
          <option value="">
            Select tenure
          </option>

          <option value="1">1 Year</option>
          <option value="2">2 Years</option>
          <option value="3">3 Years</option>
          <option value="4">4 Years</option>
          <option value="5">5 Years</option>
          <option value="6">6 Years</option>
          <option value="7">7 Years</option>
          <option value="8">8 Years</option>
          <option value="9">9 Years</option>
          <option value="10">10 Years</option>
          <option value="15">15 Years</option>
          <option value="20">20 Years</option>
        </Select>
      </div>

      {/* Calculations */}

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Maximum Affordable EMI */}

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Maximum Affordable EMI
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(
              calculations.maximumNewEMI
            )}
          </p>
        </div>

        {/* Suggested EMI */}

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Suggested EMI
          </p>

          <p className="mt-2 text-xl font-bold text-indigo-600">
            {formatCurrency(
              calculations.estimatedEMI
            )}
          </p>
        </div>

        {/* Maximum Eligible Loan */}

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Maximum Eligible Loan
          </p>

          <p className="mt-2 text-xl font-bold text-emerald-600">
            {formatCurrency(
              calculations.maximumEligibleLoan
            )}
          </p>
        </div>

        {/* Estimated Interest */}

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">
            Estimated Interest
          </p>

          <p className="mt-2 text-xl font-bold text-slate-900">
            {formatCurrency(
              calculations.estimatedInterest
            )}
          </p>
        </div>
      </div>

      {/* Total Repayment */}

      <div className="mt-4 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">
            Total Repayment
          </span>

          <span className="font-semibold text-slate-900">
            {formatCurrency(
              calculations.totalRepayment
            )}
          </span>
        </div>
      </div>

      {/* Affordability Warning */}

      {loanAmount > 0 &&
        calculations.maximumEligibleLoan > 0 &&
        calculations.exceedsEligibility && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="font-semibold text-amber-800">
              Requested loan exceeds your estimated
              affordability
            </p>

            <p className="mt-1 text-sm text-amber-700">
              Your requested loan amount is higher than
              the estimated maximum eligible loan amount.
            </p>
          </div>
        )}

      {/* Affordable Message */}

      {loanAmount > 0 &&
        calculations.maximumEligibleLoan > 0 &&
        !calculations.exceedsEligibility && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="font-semibold text-emerald-800">
              Requested loan is within your estimated
              affordability
            </p>

            <p className="mt-1 text-sm text-emerald-700">
              Your requested loan amount is within the
              calculated affordability limit.
            </p>
          </div>
        )}
    </section>
  );
}

export default LoanAffordabilityCalculator;