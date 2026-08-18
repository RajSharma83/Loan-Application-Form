import { useFormContext } from "react-hook-form";
import { Calendar } from "lucide-react";

import Select from "../../components/ui/Select";
import { getLoanLimits } from "../../constants/loanLimits";

function buildTenureOptions(loanType) {
  const limits = getLoanLimits(loanType);
  if (!limits) return [];

  const { minTenure, maxTenure } = limits;
  const step = maxTenure > 60 ? 12 : 6; // coarser steps for long tenures

  const options = [];
  for (let months = minTenure; months <= maxTenure; months += step) {
    options.push(months);
  }
  if (options[options.length - 1] !== maxTenure) {
    options.push(maxTenure);
  }

  return options;
}

function LoanTenureField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext();

  const loanType = watch("loanType");
  const tenureOptions = buildTenureOptions(loanType);

  return (
    <Select
      label="Loan Tenure (Months)"
      required
      icon={Calendar}
      error={errors.loanTenure?.message}
      {...register("loanTenure")}
    >
      <option value="">
        {loanType ? "Select loan tenure" : "Select a loan type first"}
      </option>

      {tenureOptions.map((months) => (
        <option key={months} value={months}>
          {months} months
          {months >= 12 ? ` (${(months / 12).toFixed(months % 12 ? 1 : 0)} yrs)` : ""}
        </option>
      ))}
    </Select>
  );
}

export default LoanTenureField;
