import { describe, it, expect } from "vitest";

import { verhoeffValidate, verhoeffGenerate } from "../verhoeff";

describe("Verhoeff checksum", () => {
  const prefixes = [
    "12345678901",
    "99999999999",
    "10000000001",
    "55555555555",
    "11223344556",
    "00000000000",
    "23456789012",
  ];

  it("generates a check digit that makes the full number validate", () => {
    prefixes.forEach((prefix) => {
      const check = verhoeffGenerate(prefix);
      expect(verhoeffValidate(prefix + check)).toBe(true);
    });
  });

  it("detects a single-digit tamper in the check digit position", () => {
    prefixes.forEach((prefix) => {
      const check = verhoeffGenerate(prefix);
      const tampered = (check + 1) % 10;
      expect(verhoeffValidate(prefix + tampered)).toBe(false);
    });
  });

  it("detects a single-digit tamper anywhere in the body", () => {
    const prefix = "12345678901";
    const check = verhoeffGenerate(prefix);
    const full = prefix + check;

    // Tamper each body position (not the check digit) one at a time.
    for (let i = 0; i < prefix.length; i += 1) {
      const chars = full.split("");
      const original = Number(chars[i]);
      chars[i] = String((original + 1) % 10);
      const tampered = chars.join("");

      expect(verhoeffValidate(tampered)).toBe(false);
    }
  });

  it("rejects non-numeric input instead of throwing", () => {
    expect(verhoeffValidate("12345678ABCD")).toBe(false);
    expect(verhoeffValidate("")).toBe(false);
    expect(() => verhoeffValidate(null)).not.toThrow();
  });

  it("rejects an all-zeros number with an incorrect check digit", () => {
    // Sanity check against a degenerate case.
    const prefix = "00000000000";
    const check = verhoeffGenerate(prefix);
    expect(verhoeffValidate(prefix + check)).toBe(true);
    expect(verhoeffValidate(prefix + ((check + 5) % 10))).toBe(false);
  });
});
