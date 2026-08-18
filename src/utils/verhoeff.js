/**
 * Verhoeff checksum algorithm.
 *
 * Aadhaar numbers use Verhoeff (not Luhn) for their check digit. This
 * is the standard, well-known implementation using the three lookup
 * tables: multiplication (d), permutation (p), and inverse (inv).
 *
 * Reference: J. Verhoeff, "Error Detecting Decimal Codes" (1969).
 */

const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a numeric string (as-is, check digit included) against
 * the Verhoeff checksum. Returns true iff the checksum resolves to 0.
 */
export function verhoeffValidate(numString) {
  if (!/^\d+$/.test(numString)) return false;

  let c = 0;
  const digits = numString.split("").reverse().map(Number);

  for (let i = 0; i < digits.length; i += 1) {
    c = d[c][p[i % 8][digits[i]]];
  }

  return c === 0;
}

/**
 * Generates the Verhoeff check digit for a number string that does
 * NOT yet include its check digit. Exposed for tests (to construct a
 * verifiably-valid Aadhaar-shaped test number) rather than for
 * production use, since Aadhaar numbers are issued externally.
 */
export function verhoeffGenerate(numStringWithoutCheckDigit) {
  let c = 0;
  const digits = numStringWithoutCheckDigit
    .split("")
    .reverse()
    .map(Number);

  for (let i = 0; i < digits.length; i += 1) {
    c = d[c][p[(i + 1) % 8][digits[i]]];
  }

  return inv[c];
}
