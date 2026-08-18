import LoanTypeSelector from "./LoanTypeSelector";
import LoanAmountField from "./LoanAmountField";
import LoanTenureField from "./LoanTenureField";
import ReferralCodeField from "./ReferralCodeField";
import ConditionalSection from "../../features/loanApplication/components/ConditionalSection";

function Step1LoanType() {
  return (
    <div className="step-form-content">
      <LoanTypeSelector />

      <div className="loan-form-grid">
        <LoanAmountField />
        <LoanTenureField />
      </div>

      <ReferralCodeField />

      <ConditionalSection />
    </div>
  );
}

export default Step1LoanType;