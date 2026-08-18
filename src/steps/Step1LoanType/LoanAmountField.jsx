import { CreditCard } from "lucide-react";

import CurrencyInput from "../../components/ui/Input/CurrencyInput";

function LoanAmountField() {
  return (
    <CurrencyInput
      name="loanAmount"
      label="Loan Amount (₹)"
      placeholder="Enter loan amount"
      required
      icon={CreditCard}
      data-testid="loan-amount-input"
    />
  );
}

export default LoanAmountField;