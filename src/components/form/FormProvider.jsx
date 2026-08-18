import { FormProvider as RHFProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useLoanForm from "../../hooks/useLoanForm";
import useWizardStore from "../../store/wizardStore";
import steps from "../../constants/steps";

function FormProvider({ children }) {
  const { currentStep, formData } = useWizardStore();

  const currentStepConfig = steps.find(
    (step) => step.id === currentStep
  );

  const defaultValues = {
    // Step 1
    loanType: "",
    loanAmount: "",
    loanTenure: "",
    loanPurpose: "",
    referralCode: "",
    propertyValue: "",
    downPayment: "",
    propertyType: "",
    propertyAddress: "",

    // Step 2
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    alternateMobile: "",
    dob: "",
    gender: "",
    maritalStatus: "",

    // Step 3
    pan: "",
    aadhaar: "",
    voterId: "",
    passport: "",

    // Step 4
    country: "",
    state: "",
    city: "",
    pinCode: "",
    address1: "",
    address2: "",
    residentialStatus: "",
    yearsAtAddress: "",
     previousCountry: "",
     previousState: "",
     previousCity: "",
     previousPinCode: "",
     previousAddress1: "",
     previousAddress2: "",

     permanentSameAsCurrent: false,
     permanentCountry: "",
     permanentState: "",
     permanentCity: "",
     permanentPinCode: "",
     permanentAddress1: "",
     permanentAddress2: "",

     // Step 5
  employmentType: "",

  companyName: "",
  industry: "",
  jobTitle: "",
  monthlyIncome: "",
  salaryBank: "",
  experience: "",
  experienceYears: "",
  experienceMonths: "",

  officeCountry: "",
  officeState: "",
  officeCity: "",
  officePinCode: "",
  officeAddress1: "",
  officeAddress2: "",

  businessName: "",
  businessType: "",
  annualIncome: "",
  yearsInBusiness: "",
  gstNumber: "",
  businessRegistrationNumber: "",

  businessCountry: "",
  businessState: "",
  businessCity: "",
  businessPinCode: "",
  businessAddress1: "",
  businessAddress2: "",

  collegeName: "",
  course: "",
  graduationYear: "",

  retirementSector: "",
  retirementCompanyName: "",
  retirementIndustry: "",
  pensionAmount: "",

  // Step 6 (conditional)
  coApplicantRelationship: "",
  coApplicantFirstName: "",
  coApplicantLastName: "",
  coApplicantDob: "",
  coApplicantMobile: "",
  coApplicantEmail: "",
  coApplicantPan: "",
  coApplicantMonthlyIncome: "",
  coApplicantConsent: false,

  // Step 7
  existingEMI: "",
  otherIncome: "",
  monthlyExpenses: "",
  requestedLoanAmount: "",
  interestRate: "",
  // loanTenure: "", 

  // Step 8

   panDocument: undefined,
   aadhaarFrontDocument: undefined,
   aadhaarBackDocument: undefined,
   salarySlip: undefined,
   itrDocument: undefined,
   bankStatement: undefined,
   propertyDocument: undefined,
   businessRegistrationDocument: undefined,
   gstReturnsDocument: undefined,
   photograph: undefined,
   panVerified: false,
   signature: "",

   // Step 9
   confirmAccuracy: false,
   consentCreditCheck: false,
   agreeTerms: false,
   consentCommunications: false,
   highEmiAcknowledgment: false,


    // Restore saved values
    ...formData,
  };

  const methods = useLoanForm({
    resolver: currentStepConfig?.schema
      ? zodResolver(currentStepConfig.schema)
      : undefined,

    defaultValues,
  });

  return (
    <RHFProvider {...methods}>
      {children}
    </RHFProvider>
  );
}

export default FormProvider;