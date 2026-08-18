const homeLoanConfig = {
  id: "home",
  title: "Home Loan",

  // Per the JD (Section B2, Step 6), Home Loan ALWAYS requires a
  // co-applicant regardless of amount — see isCoApplicantStepVisible in
  // constants/steps.js, which special-cases loanType === "home" rather
  // than reading a threshold here.

  fields: [
    {
      name: "loanPurpose",
      label: "Purpose of Loan",
      type: "select",

      options: [
        "New Home Purchase",
        "Home Construction",
        "Home Renovation",
        "Plot Purchase",
        "Balance Transfer",
      ],

      required: true,
    },

    {
      name: "propertyValue",
      label: "Property Value (₹)",
      type: "currency",
      required: true,
      min: 100000,
    },

    {
      name: "downPayment",
      label: "Down Payment (₹)",
      type: "currency",
      required: true,
      min: 0,
    },

    {
      name: "propertyType",
      label: "Property Type",
      type: "select",
      options: [
        "Apartment",
        "Independent House",
        "Villa",
        "Plot",
        "Commercial Property",
      ],
      required: true,
    },

    {
      name: "propertyAddress",
      label: "Property Address",
      type: "textarea",
      required: true,
      placeholder: "Enter property address",
    },
  ],
};

export default homeLoanConfig;

