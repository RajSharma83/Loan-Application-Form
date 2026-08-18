/**
 * compressImage
 * -------------
 * Downscales/re-encodes an image File on the client using a Canvas,
 * without ever blocking the main thread's synchronous execution (the
 * heavy work — decode, draw, encode — happens via async browser APIs).
 *
 * PDFs are intentionally never passed to this function — callers should
 * check `file.type === "application/pdf"` first and skip compression.
 *
 * Returns { file, originalSize, compressedSize, reduced } — if
 * compression fails or would not actually shrink the file, the
 * original file is returned unchanged so upload can still proceed.
 */

const MAX_DIMENSION = 1600; // px, longest edge
const JPEG_QUALITY = 0.75;

export async function compressImage(file) {
  const originalSize = file.size;

  if (!file.type?.startsWith("image/")) {
    return { file, originalSize, compressedSize: originalSize, reduced: false };
  }

  try {
    const bitmap = await loadBitmap(file);

    const scale = Math.min(
      1,
      MAX_DIMENSION / Math.max(bitmap.width, bitmap.height)
    );

    const targetWidth = Math.round(bitmap.width * scale);
    const targetHeight = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

    if (bitmap.close) bitmap.close();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY)
    );

    if (!blob || blob.size >= originalSize) {
      // Compression didn't help (small/already-optimized image) — keep
      // the original rather than force a worse result on the user.
      return { file, originalSize, compressedSize: originalSize, reduced: false };
    }

    const compressedFile = new File(
      [blob],
      file.name.replace(/\.\w+$/, ".jpg"),
      { type: "image/jpeg" }
    );

    return {
      file: compressedFile,
      originalSize,
      compressedSize: compressedFile.size,
      reduced: true,
    };
  } catch (error) {
    console.error("compressImage: falling back to original file", error);
    return { file, originalSize, compressedSize: originalSize, reduced: false };
  }
}

function loadBitmap(file) {
  if (typeof window.createImageBitmap === "function") {
    return window.createImageBitmap(file);
  }

  // Older browsers without createImageBitmap support.
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (error) => {
      URL.revokeObjectURL(url);
      reject(error);
    };

    img.src = url;
  });
}
