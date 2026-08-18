import CurrencyInput from "../../components/ui/Input/CurrencyInput";

function ExistingEMIField() {
  return (
    <CurrencyInput
      name="existingEMI"
      label="Existing EMI"
      placeholder="Enter total monthly EMI"
      required
    />
  );
}

export default ExistingEMIField;
