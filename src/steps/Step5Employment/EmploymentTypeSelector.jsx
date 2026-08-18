import { Controller, useFormContext } from "react-hook-form";
import {
  Briefcase,
  Building2,
  Store,
  GraduationCap,
  BadgeDollarSign,
} from "lucide-react";

import LoanTypeCard from "../../components/ui/LoanTypeCard";

function EmploymentTypeSelector() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const employmentTypes = [
    {
      value: "salaried",
      title: "Salaried",
      description: "Working in a company or organization",
      icon: <Briefcase size={32} />,
      badge: "Most Common",
      rate: "",
    },
    {
      value: "selfEmployed",
      title: "Self Employed",
      description: "An independent professional or freelancer",
      icon: <Building2 size={32} />,
      badge: null,
      rate: "",
    },
    {
      value: "businessOwner",
      title: "Business Owner",
      description: "You own and operate a registered business",
      icon: <Store size={32} />,
      badge: null,
      rate: "",
    },
    {
      value: "student",
      title: "Student",
      description: "Currently pursuing education",
      icon: <GraduationCap size={32} />,
      badge: null,
      rate: "",
    },
    {
      value: "retired",
      title: "Retired",
      description: "Receiving pension after retirement",
      icon: <BadgeDollarSign size={32} />,
      badge: null,
      rate: "",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Employment Details
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Select your current employment status.
        </p>
      </div>

      <Controller
        name="employmentType"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {employmentTypes.map((type) => (
              <LoanTypeCard
                key={type.value}
                icon={type.icon}
                title={type.title}
                description={type.description}
                badge={type.badge}
                rate={type.rate}
                selected={field.value === type.value}
                onClick={() => field.onChange(type.value)}
              />
            ))}
          </div>
        )}
      />

      {errors.employmentType && (
        <p className="text-sm font-medium text-red-500">
          {errors.employmentType.message}
        </p>
      )}
    </div>
  );
}

export default EmploymentTypeSelector;