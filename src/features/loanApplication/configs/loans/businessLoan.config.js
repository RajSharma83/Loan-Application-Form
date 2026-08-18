const businessLoanConfig = {
  id: "business",
  title: "Business Loan",

  // A co-applicant is required once the requested loan amount EXCEEDS
  // this value (strictly greater than — the boundary value itself does
  // NOT trigger it). Per JD Section B2, Step 6.
  coApplicantThreshold: 2000000,

  fields: [
    {
      name: "loanPurpose",
      label: "Purpose of Loan",
      type: "select",

      options: [
        "Working Capital",
        "Business Expansion",
        "Equipment Purchase",
        "Inventory Purchase",
        "Debt Refinancing",
      ],

      required: true,
    },
  ],
};

export default businessLoanConfig;

