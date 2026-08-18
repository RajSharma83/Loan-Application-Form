import { useFormContext } from "react-hook-form";
import Input from "../../../components/ui/Input";

function AddressLine2Field({
  name = "address2",
  label = "Address Line 2",
  placeholder = "Apartment, Landmark (Optional)",
}) {
  const { register } = useFormContext();

  return (
    <Input
      label={label}
      placeholder={placeholder}
      {...register(name)}
    />
  );
}

export default AddressLine2Field;