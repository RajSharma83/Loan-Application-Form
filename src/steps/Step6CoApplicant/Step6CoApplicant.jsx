import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Home as HomeIcon, TrendingUp } from "lucide-react";

import Input from "../../components/ui/Input";
import CurrencyInput from "../../components/ui/Input/CurrencyInput";
import Select from "../../components/ui/Select";
import loanConfigRegistry from "../../features/loanApplication/configs/loanConfigRegistry";

const RELATIONSHIP_OPTIONS = [
  "Spouse",
  "Parent",
  "Sibling",
  "Child",
  "Business Partner",
  "Other",
];

function formatINR(amount) {
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

function Step6CoApplicant() {
  const {
    register,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const maritalStatus = watch("maritalStatus");
  const threshold = loanConfigRegistry[loanType]?.coApplicantThreshold;
  const isHomeLoan = loanType === "home";

  // Cross-step dependency: if the applicant is married, Spouse is the
  // natural default relationship — one-time prefill, never overwrites
  // a choice the user already made.
  useEffect(() => {
    if (maritalStatus === "married" && !getValues("coApplicantRelationship")) {
      setValue("coApplicantRelationship", "Spouse", { shouldValidate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maritalStatus]);

  const reasonCopy = isHomeLoan
    ? "Home Loans always require a co-applicant, regardless of amount."
    : threshold
    ? `Because your requested amount exceeds ${formatINR(
        threshold
      )} for this loan type, a co-applicant is required to strengthen this application.`
    : "A co-applicant is required to strengthen this application.";

  return (
    <div className="space-y-8">
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          {isHomeLoan ? <HomeIcon size={14} /> : <TrendingUp size={14} />}
          {isHomeLoan ? "Required for Home Loans" : "Required for this loan amount"}
        </div>

        <h2 className="text-2xl font-bold text-slate-900">
          Co-Applicant Details
        </h2>

        <p className="mt-2 text-slate-500">
          {reasonCopy}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Select
          label="Relationship to Applicant"
          required
          error={errors.coApplicantRelationship?.message}
          {...register("coApplicantRelationship")}
        >
          <option value="">Select relationship</option>
          {RELATIONSHIP_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>

        <CurrencyInput
          name="coApplicantMonthlyIncome"
          label="Monthly Income"
          required
          placeholder="Enter co-applicant's monthly income"
        />

        <Input
          label="First Name"
          required
          placeholder="Co-applicant's first name"
          error={errors.coApplicantFirstName?.message}
          {...register("coApplicantFirstName", {
            onChange: (event) => {
              event.target.value = event.target.value.replace(
                /[^A-Za-z\s'-]/g,
                ""
              );
            },
          })}
        />

        <Input
          label="Last Name"
          required
          placeholder="Co-applicant's last name"
          error={errors.coApplicantLastName?.message}
          {...register("coApplicantLastName", {
            onChange: (event) => {
              event.target.value = event.target.value.replace(
                /[^A-Za-z\s'-]/g,
                ""
              );
            },
          })}
        />

        <Input
          type="date"
          label="Date of Birth"
          required
          max={new Date().toISOString().split("T")[0]}
          error={errors.coApplicantDob?.message}
          {...register("coApplicantDob")}
        />

        <Input
          label="Mobile Number"
          required
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile number"
          error={errors.coApplicantMobile?.message}
          {...register("coApplicantMobile", {
            onChange: (event) => {
              event.target.value = event.target.value.replace(/\D/g, "");
            },
          })}
        />

        <Input
          type="email"
          label="Email Address"
          required
          placeholder="co-applicant@example.com"
          error={errors.coApplicantEmail?.message}
          {...register("coApplicantEmail")}
        />

        <Input
          label="PAN Number"
          required
          maxLength={10}
          placeholder="ABCDE1234F"
          className="uppercase"
          error={errors.coApplicantPan?.message}
          {...register("coApplicantPan", {
            onChange: (event) => {
              event.target.value = event.target.value.toUpperCase();
            },
          })}
        />
      </div>

      <div
        className={`neu-surface rounded-2xl bg-white p-6 transition-colors duration-200 ${
          errors.coApplicantConsent ? "outline outline-2 outline-red-300" : ""
        }`}
      >
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            {...register("coApplicantConsent")}
            className={`skeu-checkbox mt-0.5 ${
              errors.coApplicantConsent ? "skeu-checkbox-error" : ""
            }`}
          />

          <div>
            <p
              className={`font-medium ${
                errors.coApplicantConsent
                  ? "text-red-700"
                  : "text-slate-800"
              }`}
            >
              The co-applicant consents to being included on this loan
              application and to their information being verified.
            </p>

            {errors.coApplicantConsent && (
              <p className="mt-3 text-sm font-medium text-red-600">
                {errors.coApplicantConsent.message}
              </p>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}

export default Step6CoApplicant;
