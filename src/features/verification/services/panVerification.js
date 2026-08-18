const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

const MOCK_DELAY = 2000;

export function validatePanFormat(pan) {
  return PAN_REGEX.test(pan.trim());
}

/**
 * PAN's 4th character indicates entity type: P = Individual,
 * C = Company, F = Firm, etc. Only individual PANs are valid for
 * personal/home loans; business loans also accept Company or Firm.
 * Kept in lockstep with schemas/kyc.schema.js's superRefine — this
 * mock verification must never say "verified" for a PAN the schema
 * would then reject, or the user gets stuck with no way forward.
 */
export function isEntityTypeAllowed(pan, loanType) {
  const entityChar = pan.trim()[3];
  const allowed = loanType === "business" ? ["P", "C", "F"] : ["P"];
  return allowed.includes(entityChar);
}

export async function verifyPan(pan, loanType) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!validatePanFormat(pan)) {
        reject({
          success: false,
          message: "Invalid PAN format.",
        });

        return;
      }

      if (!isEntityTypeAllowed(pan, loanType)) {
        reject({
          success: false,
          message:
            loanType === "business"
              ? "PAN 4th character must indicate entity type (P for Individual, C for Company, or F for Firm)."
              : "PAN 4th character must indicate entity type (P for Individual).",
        });

        return;
      }

      // Mock failure simulation
      if (pan === "AAAAA1111A") {
        reject({
          success: false,
          message: "PAN not found in government records.",
        });

        return;
      }

      resolve({
        success: true,
        message: "PAN validated successfully.",
        otpRequired: true,

        data: {
          pan,
          holderName: "Raj ",
          maskedMobile: "XXXXXX4321",
          status: "Pending OTP Verification",
        },
      });
    }, MOCK_DELAY);
  });
}