import loanTypeSchema from "../schemas/loanType.schema";
import personalInfoSchema from "../schemas/personalInfo.schema";
import kycSchema from "../schemas/kyc.schema";
import addressSchema from "../schemas/address.schema";
import employmentSchema from "../schemas/employment.schema";
import coApplicantSchema from "../schemas/coApplicant.schema";
import financialSchema from "../schemas/financial.schema";
import documentsSchema from "../schemas/documents.schema";

import Step1LoanType from "../steps/Step1LoanType/Step1LoanType";
import Step2PersonalInfo from "../steps/Step2PersonalInfo/Step2PersonalInfo";
import Step3KYC from "../steps/Step3KYC/Step3KYC";
import Step4Address from "../steps/Step4Address/Step4Address";
import Step5Employment from "../steps/Step5Employment/Step5Employment";
import Step6CoApplicant from "../steps/Step6CoApplicant/Step6CoApplicant";
import Step7Financial from "../steps/Step6Financial/Step6Financial";
import Step8Documents from "../steps/Step7Documents/Step7Documents";
import Step9Review from "../steps/Step8Review/Step8Review";

import loanConfigRegistry from "../features/loanApplication/configs/loanConfigRegistry";

function parseAmount(value) {
  return Number(String(value ?? "").replace(/\D/g, "")) || 0;
}

/**
 * Co-applicant requirement, per the real JD (Section B2, Step 6):
 *  - Personal Loan: required once amount EXCEEDS ₹5,00,000 (strict >)
 *  - Home Loan: ALWAYS required, regardless of amount
 *  - Business Loan: required once amount EXCEEDS ₹20,00,000 (strict >)
 */
function isCoApplicantStepVisible(formData) {
  const loanType = formData?.loanType;

  if (loanType === "home") return true;

  const threshold = loanConfigRegistry[loanType]?.coApplicantThreshold;
  if (typeof threshold !== "number") return false;

  return parseAmount(formData?.loanAmount) > threshold;
}

const steps = [
  {
  id: 1,
  title: "Loan Type",
  component: Step1LoanType,

  schema: loanTypeSchema,

  fields: [
    "loanType",
    "loanAmount",
    "loanTenure",
    "loanPurpose",
    "referralCode",
    "propertyValue",
    "downPayment",
    "propertyType",
    "propertyAddress",
  ],
},

  {
    id: 2,
    title: "Personal Information",
    component: Step2PersonalInfo,

    schema: personalInfoSchema,

    fields: [
      "firstName",
      "lastName",
      "fatherName",
      "motherName",
      "email",
      "mobile",
      "alternateMobile",
      "dob",
      "gender",
      "maritalStatus",
    ],
  },

  {
  id: 3,
  title: "KYC Verification",
  component: Step3KYC,

  schema: kycSchema,

  fields: [
    "pan",
    "aadhaar",
    "voterId",
    "passport",
  ],
},

 {
  id: 4,
  title: "Address",
  component: Step4Address,

  schema: addressSchema,

  fields: [
    "country",
    "state",
    "city",
    "pinCode",
    "address1",
    "address2",
    "residentialStatus",
    "yearsAtAddress",

      // Previous Address
    "previousCountry",
    "previousState",
    "previousCity",
    "previousPinCode",
    "previousAddress1",
    "previousAddress2",

    // Permanent Address
    "permanentSameAsCurrent",
    "permanentCountry",
    "permanentState",
    "permanentCity",
    "permanentPinCode",
    "permanentAddress1",
    "permanentAddress2",
  ],
},

   {
  id: 5,
  title: "Employment",
  component: Step5Employment,

  schema: employmentSchema,

  fields: [
    // =====================================================
    // Employment Type
    // =====================================================

    "employmentType",

    // =====================================================
    // Salaried
    // =====================================================

    "companyName",
    "industry",
    "jobTitle",
    "monthlyIncome",
    "salaryBank",
    "experienceYears",
    "experienceMonths",

    // =====================================================
    // Office Address
    // =====================================================

    "officeCountry",
    "officeState",
    "officeCity",
    "officePinCode",
    "officeAddress1",
    "officeAddress2",

    // =====================================================
    // Self Employed
    // =====================================================

    "businessName",
    "businessType",
    "annualIncome",
    "yearsInBusiness",
    "gstNumber",
    "businessRegistrationNumber",

    // =====================================================
    // Business Address
    // =====================================================

    "businessCountry",
    "businessState",
    "businessCity",
    "businessPinCode",
    "businessAddress1",
    "businessAddress2",

    // =====================================================
    // Student
    // =====================================================

    "collegeName",
    "course",
    "graduationYear",

    // =====================================================
    // Retired
    // =====================================================

       "retirementSector",
       "retirementCompanyName",
       "retirementIndustry",
       "pensionAmount",
         ],
        },

  {
    id: 6,
    title: "Co-Applicant",
    component: Step6CoApplicant,

    schema: coApplicantSchema,

    // Conditional step: only shown once the requested loan amount
    // exceeds the loan type's co-applicant threshold. See
    // isCoApplicantStepVisible above and utils/visibleSteps.js for how
    // navigation/progress skip this step when hidden.
    isVisible: isCoApplicantStepVisible,

    fields: [
      "coApplicantRelationship",
      "coApplicantFirstName",
      "coApplicantLastName",
      "coApplicantDob",
      "coApplicantMobile",
      "coApplicantEmail",
      "coApplicantPan",
      "coApplicantMonthlyIncome",
      "coApplicantConsent",
    ],
  },

  {
  id: 7,
  title: "Financial Details",
  component: Step7Financial,

  schema: financialSchema,

  fields: [
    "monthlyIncome",
    "existingEMI",
    "otherIncome",
    "monthlyExpenses",
    "requestedLoanAmount",
    "interestRate",
    "loanTenure",
   ],
  },

 {
  id: 8,
  title: "Documents",
  component: Step8Documents,

  schema: documentsSchema,

   fields: [
    "panDocument",
    "aadhaarFrontDocument",
    "aadhaarBackDocument",
    "salarySlip",
    "itrDocument",
    "bankStatement",
    "propertyDocument",
    "businessRegistrationDocument",
    "gstReturnsDocument",
    "photograph",
    "signature",
    ],
   },

    {
  id: 9,
  title: "Review & Submit",
  component: Step9Review,

  fields: [
    "confirmAccuracy",
    "consentCreditCheck",
    "agreeTerms",
    "consentCommunications",
  ],
},
];

export default steps;
