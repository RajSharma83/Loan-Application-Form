import "@testing-library/jest-dom/vitest";
import { webcrypto } from "node:crypto";

// jsdom doesn't implement SubtleCrypto — Node's built-in webcrypto is a
// spec-compliant stand-in for AES-GCM encrypt/decrypt in tests.
if (!globalThis.crypto?.subtle) {
  globalThis.crypto = webcrypto;
}
