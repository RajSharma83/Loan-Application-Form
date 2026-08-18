/**
 * Masking helpers for sensitive KYC identifiers. These are for DISPLAY
 * only — never used to alter the actual value being validated/submitted.
 */

export function maskPAN(pan) {
  if (!pan || pan.length < 4) return pan ?? "";

  const visibleStart = pan.slice(0, 2);
  const visibleEnd = pan.slice(-2);
  const masked = "*".repeat(Math.max(0, pan.length - 4));

  return `${visibleStart}${masked}${visibleEnd}`;
}

export function maskAadhaar(aadhaar) {
  if (!aadhaar || aadhaar.length < 4) return aadhaar ?? "";

  const digitsOnly = aadhaar.replace(/\D/g, "");
  const lastFour = digitsOnly.slice(-4);
  const maskedGroup = "XXXX";

  if (digitsOnly.length !== 12) {
    // Not a well-formed 12-digit Aadhaar — mask everything but the
    // last 4 characters rather than assume the group structure.
    return `${"*".repeat(Math.max(0, aadhaar.length - 4))}${aadhaar.slice(-4)}`;
  }

  return `${maskedGroup} ${maskedGroup} ${lastFour}`;
}
