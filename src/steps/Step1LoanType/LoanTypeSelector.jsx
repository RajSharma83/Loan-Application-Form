import { Controller, useFormContext } from "react-hook-form";
import {
  CreditCard,
  Home,
  BriefcaseBusiness,
} from "lucide-react";

import LoanTypeCard from "../../components/ui/LoanTypeCard";
import INTEREST_RATES from "../../constants/interestRates";

const loanTypes = [
  {
    value: "personal",
    title: "Personal Loan",
    description:
      "Fast approval with flexible repayment options.",
    icon: <CreditCard size={23} />,
    badge: "Most Popular",
    rate: `${INTEREST_RATES.personal}% p.a.`,
  },
  {
    value: "home",
    title: "Home Loan",
    description:
      "Affordable interest rates for your dream home.",
    icon: <Home size={23} />,
    badge: null,
    rate: `${INTEREST_RATES.home}% p.a.`,
  },
  {
    value: "business",
    title: "Business Loan",
    description:
      "Flexible funding to help your business grow.",
    icon: <BriefcaseBusiness size={23} />,
    badge: null,
    rate: `${INTEREST_RATES.business}% p.a.`,
  },
];

function LoanTypeSelector() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="loan-type-section">
      <div>
        <h2 className="loan-section-title">
          Choose Your Loan Type
        </h2>

        <p className="loan-section-description">
          Select the loan that best matches your financial needs.
        </p>
      </div>

      <Controller
        name="loanType"
        control={control}
        render={({ field }) => (
          <div className="loan-type-grid">
            {loanTypes.map((loan) => (
              <LoanTypeCard
                key={loan.value}
                icon={loan.icon}
                title={loan.title}
                description={loan.description}
                badge={loan.badge}
                rate={loan.rate}
                selected={field.value === loan.value}
                onClick={() => field.onChange(loan.value)}
              />
            ))}
          </div>
        )}
      />

      {errors.loanType && (
        <p className="text-sm font-medium text-red-500">
          {errors.loanType.message}
        </p>
      )}
    </div>
  );
}

export default LoanTypeSelector;