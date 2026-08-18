import { useCallback, useRef, useState } from "react";

import { compressImage } from "../utils/imageCompression";

const DEFAULT_ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const UPLOAD_TICK_MS = 120;

function validateFile(file, maxSizeBytes, acceptedTypes) {
  if (!file) return "Please select a file.";

  if (!acceptedTypes.includes(file.type)) {
    const formatsLabel = acceptedTypes
      .map((t) => (t === "application/pdf" ? "PDF" : t.split("/")[1].toUpperCase()))
      .join(", ");
    return `Only ${formatsLabel} files are allowed.`;
  }

  if (file.size > maxSizeBytes) {
    return `File is too large (${(file.size / 1024 / 1024).toFixed(
      1
    )}MB). Maximum size is ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB.`;
  }

  return null;
}

/**
 * Drives one document slot's upload flow:
 *   idle -> compressing (images only) -> uploading (simulated) -> done
 * with an `error` state reachable from any step, and a `reset` escape
 * hatch so a bad file never leaves the UI stuck.
 *
 * maxSizeMB / acceptedTypes let callers apply the per-document limits
 * from documentConfig.js (e.g. bank statements allow up to 10MB, a
 * photograph only accepts JPG/PNG) instead of one blanket rule for
 * every document slot in the app.
 */
export default function useDocumentUpload({
  onComplete,
  maxSizeMB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES,
}) {
  const maxSizeBytes = (maxSizeMB ?? 5) * 1024 * 1024;

  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [compressionInfo, setCompressionInfo] = useState(null);

  const intervalRef = useRef(null);

  const clearProgressTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const simulateUpload = useCallback(
    (finalFile) => {
      setStatus("uploading");
      setProgress(0);

      clearProgressTimer();

      intervalRef.current = window.setInterval(() => {
        setProgress((current) => {
          const next = Math.min(100, current + Math.random() * 22 + 8);

          if (next >= 100) {
            clearProgressTimer();
            setStatus("done");
            onComplete?.(finalFile);
            return 100;
          }

          return next;
        });
      }, UPLOAD_TICK_MS);
    },
    [onComplete]
  );

  const handleFile = useCallback(
    async (file) => {
      clearProgressTimer();
      setError(null);
      setCompressionInfo(null);

      const validationError = validateFile(file, maxSizeBytes, acceptedTypes);
      if (validationError) {
        setStatus("error");
        setError(validationError);
        return;
      }

      if (file.type === "application/pdf") {
        // PDFs are never compressed, per spec.
        simulateUpload(file);
        return;
      }

      try {
        setStatus("compressing");
        const result = await compressImage(file);

        setCompressionInfo({
          originalSize: result.originalSize,
          compressedSize: result.compressedSize,
          reduced: result.reduced,
        });

        simulateUpload(result.file);
      } catch (err) {
        console.error("useDocumentUpload: compression failed", err);
        // Recovery: fall back to uploading the original, uncompressed
        // file rather than blocking the user entirely.
        simulateUpload(file);
      }
    },
    [simulateUpload, maxSizeBytes, acceptedTypes]
  );

  const reset = useCallback(() => {
    clearProgressTimer();
    setStatus("idle");
    setProgress(0);
    setError(null);
    setCompressionInfo(null);
  }, []);

  const reportError = useCallback((message) => {
    clearProgressTimer();
    setStatus("error");
    setError(message);
  }, []);

  return {
    status,
    progress,
    error,
    compressionInfo,
    handleFile,
    reset,
    reportError,
  };
}
