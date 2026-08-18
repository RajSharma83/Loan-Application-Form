/**
 * Full document matrix, per JD Section B2 (Step 7 table). Required
 * documents depend on loan type, employment type, and whether PAN was
 * already verified in Step 3 (per the cross-step dependency map,
 * Section B3: "If PAN verified, PAN copy upload is optional").
 */

const PDF_ONLY = ["application/pdf"];
const IMAGE_AND_PDF = ["image/jpeg", "image/png", "application/pdf"];
const IMAGE_ONLY = ["image/jpeg", "image/png"];

function getDocumentConfig({ loanType, employmentType, panVerified } = {}) {
  const documents = [
    {
      name: "panDocument",
      title: "PAN Card Copy",
      // Cross-step dependency: if PAN was already verified in Step 3,
      // uploading a copy here is optional rather than required.
      required: !panVerified,
      maxSizeMB: 5,
      acceptedTypes: IMAGE_AND_PDF,
    },

    {
      name: "aadhaarFrontDocument",
      title: "Aadhaar Card (Front)",
      required: true,
      maxSizeMB: 5,
      acceptedTypes: IMAGE_AND_PDF,
    },

    {
      name: "aadhaarBackDocument",
      title: "Aadhaar Card (Back)",
      required: true,
      maxSizeMB: 5,
      acceptedTypes: IMAGE_AND_PDF,
    },
  ];

  if (employmentType === "salaried") {
    documents.push({
      name: "salarySlip",
      title: "Salary Slips (Last 3 Months)",
      required: true,
      maxSizeMB: 5,
      acceptedTypes: PDF_ONLY,
    });
  }

  documents.push({
    name: "bankStatement",
    title: "Bank Statements (Last 6 Months)",
    required: true,
    maxSizeMB: 10,
    acceptedTypes: PDF_ONLY,
  });

  if (
    employmentType === "selfEmployed" ||
    employmentType === "businessOwner"
  ) {
    documents.push({
      name: "itrDocument",
      title: "ITR (Last 2 Years)",
      required: true,
      maxSizeMB: 5,
      acceptedTypes: PDF_ONLY,
    });
  }

  if (loanType === "home") {
    documents.push({
      name: "propertyDocument",
      title: "Property Documents",
      required: true,
      maxSizeMB: 10,
      acceptedTypes: PDF_ONLY,
    });
  }

  if (loanType === "business") {
    documents.push(
      {
        name: "businessRegistrationDocument",
        title: "Business Registration Certificate",
        required: true,
        maxSizeMB: 5,
        acceptedTypes: PDF_ONLY,
      },
      {
        name: "gstReturnsDocument",
        title: "GST Returns (Last 4 Quarters)",
        required: true,
        maxSizeMB: 5,
        acceptedTypes: PDF_ONLY,
      }
    );
  }

  documents.push({
    name: "photograph",
    title: "Photograph (Passport Size)",
    required: true,
    maxSizeMB: 2,
    acceptedTypes: IMAGE_ONLY,
  });

  return documents;
}

export default getDocumentConfig;
