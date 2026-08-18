import { useFormContext } from "react-hook-form";
import Input from "../../../components/ui/Input";

function AddressLine1Field({
  name = "address1",
  label = "Address Line 1",
  placeholder = "House No., Street, Area",
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Input
      label={label}
      required
      placeholder={placeholder}
      error={errors[name]?.message}
      {...register(name)}
    />
  );
}

export default AddressLine1Field;