import personalLoanConfig from "./loans/personalLoan.config";
import homeLoanConfig from "./loans/homeLoan.config";
import businessLoanConfig from "./loans/businessLoan.config";

const loanConfigRegistry = {
  personal: personalLoanConfig,
  home: homeLoanConfig,
  business: businessLoanConfig,
};

export default loanConfigRegistry;