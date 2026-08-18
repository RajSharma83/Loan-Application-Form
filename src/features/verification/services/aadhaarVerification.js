import { verhoeffValidate } from "../../../utils/verhoeff";

const AADHAAR_REGEX = /^\d{12}$/;

const MOCK_DELAY = 2000;

export function validateAadhaarFormat(aadhaar) {
  return AADHAAR_REGEX.test(
    aadhaar.replace(/\s/g, "")
  );
}

export async function verifyAadhaar(aadhaar) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const cleaned = aadhaar.replace(/\s/g, "");

      if (!validateAadhaarFormat(cleaned)) {
        reject({
          success: false,
          message: "Invalid Aadhaar Number.",
        });

        return;
      }

      // Kept in lockstep with schemas/kyc.schema.js's Verhoeff check —
      // this mock verification must never say "verified" for an
      // Aadhaar the schema would then reject.
      if (!verhoeffValidate(cleaned)) {
        reject({
          success: false,
          message: "Invalid Aadhaar number (checksum verification failed).",
        });

        return;
      }

      // Mock failure
      if (cleaned === "111111111111") {
        reject({
          success: false,
          message:
            "Aadhaar not found in government records.",
        });

        return;
      }

      resolve({
        success: true,
        message: "Aadhaar validated successfully.",
        otpRequired: true,

        data: {
          aadhaar: cleaned,
          holderName: "Raj ",
          maskedMobile: "XXXXXX4321",
          status: "Pending OTP Verification",
        },
      });
    }, MOCK_DELAY);
  });
}