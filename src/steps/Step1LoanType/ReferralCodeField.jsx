import { useFormContext } from "react-hook-form";
import { Tag } from "lucide-react";

import Input from "../../components/ui/Input";

function ReferralCodeField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      label="Referral Code (Optional)"
      placeholder="Enter referral code, if you have one"
      icon={Tag}
      error={errors.referralCode?.message}
      {...register("referralCode", {
        onChange: (e) => {
          e.target.value = e.target.value.toUpperCase();
        },
      })}
    />
  );
}

export default ReferralCodeField;
