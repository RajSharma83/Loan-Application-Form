import { describe, it, expect } from "vitest";

import kycSchema from "../kyc.schema";
import personalInfoSchema from "../personalInfo.schema";
import coApplicantSchema from "../coApplicant.schema";
import { verhoeffGenerate } from "../../utils/verhoeff";

// A genuinely Verhoeff-valid 12-digit test number — computed via
// verhoeffGenerate at test-run time (not hardcoded/guessed), so
// checksum-dependent tests below are testing the real algorithm
// rather than an arbitrary string that might coincidentally pass.
const VALID_AADHAAR = "23456789012" + verhoeffGenerate("23456789012");

describe("KYC schema", () => {
  it("accepts a correctly formatted, individual PAN for a personal loan", () => {
    const result = kycSchema.safeParse({
      pan: "AAAPL1234C", // 4th char P = Individual
      aadhaar: VALID_AADHAAR,
      loanType: "personal",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a non-individual PAN (4th char isn't 'P') for a personal loan", () => {
    const result = kycSchema.safeParse({
      pan: "AAACL1234C", // 4th char C = Company
      aadhaar: VALID_AADHAAR,
      loanType: "personal",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a Company PAN (4th char 'C') for a business loan", () => {
    const result = kycSchema.safeParse({
      pan: "AAACL1234C",
      aadhaar: VALID_AADHAAR,
      loanType: "business",
    });
    expect(result.success).toBe(true);
  });

  it("accepts a Firm PAN (4th char 'F') for a business loan", () => {
    const result = kycSchema.safeParse({
      pan: "AAAFL1234C",
      aadhaar: VALID_AADHAAR,
      loanType: "business",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a Trust PAN (4th char 'T') even for a business loan — not in the allowed set", () => {
    const result = kycSchema.safeParse({
      pan: "AAATL1234C",
      aadhaar: VALID_AADHAAR,
      loanType: "business",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a PAN with the wrong pattern", () => {
    const result = kycSchema.safeParse({
      pan: "1234ABCDEF",
      aadhaar: VALID_AADHAAR,
      loanType: "personal",
    });
    expect(result.success).toBe(false);
  });

  it("accepts an Aadhaar that passes the Verhoeff checksum", () => {
    const result = kycSchema.safeParse({
      pan: "AAAPL1234C",
      aadhaar: VALID_AADHAAR,
      loanType: "personal",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an Aadhaar with a tampered digit (fails Verhoeff checksum)", () => {
    const prefix = VALID_AADHAAR.slice(0, 11);
    const correctCheck = Number(VALID_AADHAAR[11]);
    const tamperedCheck = (correctCheck + 1) % 10;

    const result = kycSchema.safeParse({
      pan: "AAAPL1234C",
      aadhaar: prefix + tamperedCheck,
      loanType: "personal",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an Aadhaar that isn't exactly 12 digits", () => {
    const tooShort = kycSchema.safeParse({
      pan: "AAAPL1234C",
      aadhaar: "12345",
      loanType: "personal",
    });
    const tooLong = kycSchema.safeParse({
      pan: "AAAPL1234C",
      aadhaar: "1234567890123",
      loanType: "personal",
    });

    expect(tooShort.success).toBe(false);
    expect(tooLong.success).toBe(false);
  });
});

describe("Personal info schema — age boundary", () => {
  function dobYearsAgo(years, extraDays = 0) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    d.setDate(d.getDate() - extraDays);
    return d.toISOString().split("T")[0];
  }

  const base = {
    firstName: "Asha",
    lastName: "Rao",
    email: "asha@example.com",
    countryCode: "+91",
    mobile: "9876543210",
    gender: "female",
    maritalStatus: "single",
  };

  it("rejects an applicant who turns 18 tomorrow (17 years old today)", () => {
    const result = personalInfoSchema.safeParse({
      ...base,
      dob: dobYearsAgo(18, -1), // 1 day short of 18
    });
    expect(result.success).toBe(false);
  });

  it("accepts an applicant who turned 18 exactly today", () => {
    const result = personalInfoSchema.safeParse({
      ...base,
      dob: dobYearsAgo(18),
    });
    expect(result.success).toBe(true);
  });

  it("accepts a well-established adult", () => {
    const result = personalInfoSchema.safeParse({
      ...base,
      dob: dobYearsAgo(35),
    });
    expect(result.success).toBe(true);
  });
});

describe("Co-Applicant schema", () => {
  function dobYearsAgo(years) {
    const d = new Date();
    d.setFullYear(d.getFullYear() - years);
    return d.toISOString().split("T")[0];
  }

  const validCoApplicant = {
    coApplicantRelationship: "Spouse",
    coApplicantFirstName: "Priya",
    coApplicantLastName: "Sharma",
    coApplicantDob: dobYearsAgo(30),
    coApplicantMobile: "9876543210",
    coApplicantEmail: "priya@example.com",
    coApplicantPan: "ABCDE1234F",
    coApplicantMonthlyIncome: "50000",
    coApplicantConsent: true,
  };

  it("accepts a fully valid co-applicant", () => {
    expect(coApplicantSchema.safeParse(validCoApplicant).success).toBe(true);
  });

  it("rejects when consent is not given", () => {
    const result = coApplicantSchema.safeParse({
      ...validCoApplicant,
      coApplicantConsent: false,
    });
    expect(result.success).toBe(false);
  });

  it("rejects a co-applicant under 18", () => {
    const result = coApplicantSchema.safeParse({
      ...validCoApplicant,
      coApplicantDob: dobYearsAgo(17),
    });
    expect(result.success).toBe(false);
  });

  it("rejects a co-applicant over 75", () => {
    const result = coApplicantSchema.safeParse({
      ...validCoApplicant,
      coApplicantDob: dobYearsAgo(76),
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid PAN format", () => {
    const result = coApplicantSchema.safeParse({
      ...validCoApplicant,
      coApplicantPan: "NOTAPAN123",
    });
    expect(result.success).toBe(false);
  });

  it("rejects monthly income below ₹5,000", () => {
    const result = coApplicantSchema.safeParse({
      ...validCoApplicant,
      coApplicantMonthlyIncome: "2000",
    });
    expect(result.success).toBe(false);
  });
});
