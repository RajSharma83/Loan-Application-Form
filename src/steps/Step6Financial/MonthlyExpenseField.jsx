import CurrencyInput from "../../components/ui/Input/CurrencyInput";

function MonthlyExpenseField() {
  return (
    <CurrencyInput
      name="monthlyExpenses"
      label="Monthly Expenses"
      placeholder="Enter monthly expenses"
      required
    />
  );
}

export default MonthlyExpenseField;
