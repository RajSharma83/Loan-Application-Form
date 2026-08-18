import { useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";

function VoterIdField() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      label="Voter ID (Optional)"
      placeholder="ABC1234567"
      maxLength={10}
      className="uppercase"
      error={errors.voterId?.message}
      {...register("voterId", {
        onChange: (e) => {
          e.target.value = e.target.value.toUpperCase();
        },
      })}
    />
  );
}

export default VoterIdField;
