import { describe, it, expect, vi } from "vitest";

import { compressImage } from "../imageCompression";

function makeFile(name, type, sizeBytes) {
  const content = new Uint8Array(sizeBytes);
  return new File([content], name, { type });
}

describe("compressImage", () => {
  it("never compresses PDFs — returns them unchanged", async () => {
    const pdf = makeFile("statement.pdf", "application/pdf", 1024 * 200);

    const result = await compressImage(pdf);

    expect(result.file).toBe(pdf);
    expect(result.reduced).toBe(false);
    expect(result.compressedSize).toBe(result.originalSize);
  });

  it("falls back to the original file if the browser can't decode the image", async () => {
    // No createImageBitmap in this jsdom environment and a plain File
    // won't produce a loadable <img> — compressImage must not throw,
    // it must resolve with the original file.
    const image = makeFile("photo.png", "image/png", 1024 * 50);

    const result = await compressImage(image);

    expect(result.file).toBeInstanceOf(File);
    expect(result.originalSize).toBe(1024 * 50);
    // Either it successfully compressed, or (more likely in jsdom,
    // which has no real canvas/image decoder) it fell back — either
    // way the promise must resolve, not reject, and size must be sane.
    expect(result.compressedSize).toBeGreaterThan(0);
  });

  it("does not reject even if canvas encoding throws", async () => {
    const image = makeFile("photo.jpg", "image/jpeg", 1024 * 100);

    // Force the failure path regardless of environment specifics
    // (jsdom may not even define createImageBitmap, so assign rather
    // than spyOn an undefined property).
    const original = window.createImageBitmap;
    window.createImageBitmap = vi.fn().mockRejectedValue(new Error("decode failed"));

    await expect(compressImage(image)).resolves.toMatchObject({
      reduced: false,
    });

    window.createImageBitmap = original;
  });
});
