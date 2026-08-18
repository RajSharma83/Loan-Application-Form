import { maskPAN, maskAadhaar } from "../../utils/maskPII";

const reviewConfig = [
  {
    title: "Loan Details",
    step: 1,
    fields: [
      { label: "Loan Type", key: "loanType" },
      { label: "Loan Amount", key: "loanAmount" },
      { label: "Loan Tenure", key: "loanTenure" },
      { label: "Purpose", key: "loanPurpose" },
      { label: "Referral Code", key: "referralCode" },
    ],
  },

  {
    title: "Personal Information",
    step: 2,
    fields: [
      { label: "First Name", key: "firstName" },
      { label: "Last Name", key: "lastName" },
      { label: "Father's Name", key: "fatherName" },
      { label: "Mother's Name", key: "motherName" },
      { label: "Email", key: "email" },
      { label: "Mobile", key: "mobile" },
      { label: "Alternate Mobile", key: "alternateMobile" },
      { label: "Date of Birth", key: "dob" },
      { label: "Gender", key: "gender" },
      { label: "Marital Status", key: "maritalStatus" },
    ],
  },

  {
    title: "KYC",
    step: 3,
    fields: [
      { label: "PAN", key: "pan", mask: maskPAN },
      { label: "Aadhaar", key: "aadhaar", mask: maskAadhaar },
      { label: "Voter ID", key: "voterId" },
      { label: "Passport", key: "passport" },
    ],
  },

  {
    title: "Address",
    step: 4,
    fields: [
      { label: "Country", key: "country" },
      { label: "State", key: "state" },
      { label: "City", key: "city" },
      { label: "PIN Code", key: "pinCode" },
      { label: "Address", key: "address1" },
      { label: "Residential Status", key: "residentialStatus" },
      { label: "Permanent Address City", key: "permanentCity" },
      { label: "Permanent Address PIN", key: "permanentPinCode" },
    ],
  },

  {
    title: "Employment",
    step: 5,
    fields: [
      { label: "Employment Type", key: "employmentType" },
      { label: "Company", key: "companyName" },
      { label: "Business", key: "businessName" },
      { label: "GST Number", key: "gstNumber" },
      { label: "College", key: "collegeName" },
      { label: "Monthly Income", key: "monthlyIncome" },
      { label: "Annual Income", key: "annualIncome" },
      { label: "Pension", key: "pensionAmount" },
    ],
  },

  {
    title: "Co-Applicant",
    step: 6,
    conditional: true,
    fields: [
      { label: "Relationship", key: "coApplicantRelationship" },
      { label: "Full Name", key: "coApplicantFirstName" },
      { label: "Mobile", key: "coApplicantMobile" },
      { label: "Email", key: "coApplicantEmail" },
      { label: "PAN", key: "coApplicantPan", mask: maskPAN },
      { label: "Monthly Income", key: "coApplicantMonthlyIncome" },
    ],
  },

  {
    title: "Financial Details",
    step: 7,
    fields: [
      { label: "Monthly Income", key: "monthlyIncome" },
      { label: "Existing EMI", key: "existingEMI" },
      { label: "Other Income", key: "otherIncome" },
      { label: "Monthly Expenses", key: "monthlyExpenses" },
    ],
  },

  {
    title: "Documents",
    step: 8,
    fields: [
      { label: "PAN Card", key: "panDocument" },
      { label: "Aadhaar Card (Front)", key: "aadhaarFrontDocument" },
      { label: "Aadhaar Card (Back)", key: "aadhaarBackDocument" },
      { label: "Salary Slip", key: "salarySlip" },
      { label: "ITR Acknowledgment", key: "itrDocument" },
      { label: "Bank Statement", key: "bankStatement" },
      { label: "Property Documents", key: "propertyDocument" },
      { label: "Business Registration", key: "businessRegistrationDocument" },
      { label: "GST Returns", key: "gstReturnsDocument" },
      { label: "Photograph", key: "photograph" },
    ],
  },
];

export default reviewConfig;