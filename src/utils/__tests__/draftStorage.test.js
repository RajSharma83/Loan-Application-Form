import { describe, it, expect, beforeEach } from "vitest";

import {
  saveDraft,
  loadValidDraft,
  clearDraft,
  DRAFT_SCHEMA_VERSION,
  DRAFT_STORAGE_KEY,
} from "../draftStorage";
import { encryptToStorage } from "../secureStorage";

beforeEach(() => {
  window.localStorage.clear();
});

describe("draft persistence", () => {
  it("round-trips a saved draft (encrypted at rest, decrypted on load)", async () => {
    await saveDraft({
      currentStep: 3,
      formData: { loanType: "personal", loanAmount: "250000", firstName: "Asha" },
      panVerified: true,
      aadhaarVerified: false,
    });

    // Sanity check: the raw localStorage value must NOT contain the
    // plaintext PII — that's the whole point of encrypting it.
    const draftRaw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    expect(draftRaw).not.toContain("Asha");
    expect(draftRaw).not.toContain("personal");

    const draft = await loadValidDraft();
    expect(draft).not.toBeNull();
    expect(draft.currentStep).toBe(3);
    expect(draft.formData.firstName).toBe("Asha");
    expect(draft.panVerified).toBe(true);
  });

  it("returns null when there is no draft", async () => {
    const draft = await loadValidDraft();
    expect(draft).toBeNull();
  });

  it("discards and clears a draft older than the 72-hour TTL", async () => {
    const realNow = Date.now;
    // Save "3 days ago".
    Date.now = () => realNow() - 73 * 60 * 60 * 1000;

    await saveDraft({
      currentStep: 2,
      formData: { loanType: "home" },
      panVerified: false,
      aadhaarVerified: false,
    });

    Date.now = realNow;

    const draft = await loadValidDraft();
    expect(draft).toBeNull();

    // Expired draft should have been removed, not just ignored.
    const second = await loadValidDraft();
    expect(second).toBeNull();
  });

  it("keeps a draft saved 71 hours ago (just inside the TTL)", async () => {
    const realNow = Date.now;
    Date.now = () => realNow() - 71 * 60 * 60 * 1000;

    await saveDraft({
      currentStep: 4,
      formData: { loanType: "business" },
      panVerified: false,
      aadhaarVerified: false,
    });

    Date.now = realNow;

    const draft = await loadValidDraft();
    expect(draft).not.toBeNull();
    expect(draft.currentStep).toBe(4);
  });

  it("discards a draft written under an old schema version", async () => {
    await encryptToStorage(DRAFT_STORAGE_KEY, {
      schemaVersion: DRAFT_SCHEMA_VERSION - 1,
      timestamp: Date.now(),
      loanType: "personal",
      currentStep: 3,
      formData: { loanType: "personal" },
    });

    const draft = await loadValidDraft();
    expect(draft).toBeNull();
  });

  it("discards a draft pointing at a step that no longer exists", async () => {
    await saveDraft({
      currentStep: 999,
      formData: { loanType: "personal" },
      panVerified: false,
      aadhaarVerified: false,
    });

    const draft = await loadValidDraft();
    expect(draft).toBeNull();
  });

  it("discards corrupted localStorage content instead of throwing", async () => {
    // Find whatever key saveDraft would have used and corrupt it.
    await saveDraft({
      currentStep: 2,
      formData: {},
      panVerified: false,
      aadhaarVerified: false,
    });

    const key = DRAFT_STORAGE_KEY;
    window.localStorage.setItem(key, "{not valid json or ciphertext");

    await expect(loadValidDraft()).resolves.toBeNull();
  });

  it("clearDraft removes the draft so it can't be resumed again", async () => {
    await saveDraft({
      currentStep: 5,
      formData: { loanType: "personal" },
      panVerified: false,
      aadhaarVerified: false,
    });

    clearDraft();

    const draft = await loadValidDraft();
    expect(draft).toBeNull();
  });
});
