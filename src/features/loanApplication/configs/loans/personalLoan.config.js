const personalLoanConfig = {
  id: "personal",

  title: "Personal Loan",

  // A co-applicant is required once the requested loan amount EXCEEDS
  // this value (strictly greater than — ₹5,00,000 itself does NOT
  // trigger it). Per JD Section B2, Step 6.
  coApplicantThreshold: 500000,

  fields: [
    {
      name: "loanPurpose",
      label: "Purpose of Loan",
      type: "select",

      options: [
        "Medical",
        "Education",
        "Travel",
        "Wedding",
        "Other",
      ],

      required: true,
    },
  ],
};

export default personalLoanConfig;