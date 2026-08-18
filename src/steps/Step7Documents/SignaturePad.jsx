import { useEffect, useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";
import SignatureCanvas from "react-signature-canvas";
import { Eraser, PenLine } from "lucide-react";

function SignaturePad() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name="signature"
      control={control}
      defaultValue=""
      render={({ field }) => (
        <SignaturePadInner
          value={field.value}
          onChange={field.onChange}
          error={errors.signature?.message}
        />
      )}
    />
  );
}

// Fixed internal drawing-buffer resolution. IMPORTANT: this must never
// change after mount — changing a <canvas> element's width/height
// ATTRIBUTE (not CSS width/height) wipes its drawing buffer natively
// in every browser, regardless of any library logic. That was the
// actual cause of "I signed, but it says empty": the previous version
// re-measured the container and changed this on every window resize,
// so ANY resize after signing (even a scrollbar toggling when a file
// preview appeared) silently erased the signature while the form
// still held the earlier value, an inconsistent state.
//
// Responsiveness ("adjust canvas size for mobile viewports", per the
// JD) is instead handled purely via CSS (w-full below) — the internal
// resolution stays fixed, the display size scales with the
// container. signature_pad maps pointer coordinates through
// getBoundingClientRect(), so this scaling doesn't affect drawing
// accuracy.
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 200;

function SignaturePadInner({ value, onChange, error }) {
  const sigRef = useRef(null);
  const hasRestoredRef = useRef(false);

  // Restore a previously-saved signature (e.g. after navigating back
  // from Review, or resuming a draft) once the canvas mounts. Runs
  // once — the canvas is never re-sized after this, so there's no
  // repeated wipe/restore cycle to guard against.
  useEffect(() => {
    if (
      value &&
      !hasRestoredRef.current &&
      sigRef.current &&
      sigRef.current.isEmpty()
    ) {
      sigRef.current.fromDataURL(value);
      hasRestoredRef.current = true;
    }
  }, [value]);

  const commit = () => {
    if (!sigRef.current || sigRef.current.isEmpty()) {
      onChange("");
      return;
    }

    // Use the full (untrimmed) canvas rather than getTrimmedCanvas() —
    // trimming is an extra step that can misfire on edge cases (e.g.
    // a signature touching the canvas boundary); the untrimmed
    // version always reliably captures exactly what was drawn.
    onChange(sigRef.current.toDataURL("image/png"));
  };

  const handleClear = () => {
    sigRef.current?.clear();
    hasRestoredRef.current = false;
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <PenLine size={16} />
          Signature
          <span className="text-red-500">*</span>
        </label>

        <button
          type="button"
          onClick={handleClear}
          className="skeu-btn flex min-h-11 items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          <Eraser size={14} />
          Clear
        </button>
      </div>

      <div
        className={`w-full overflow-hidden rounded-xl border-2 bg-white ${
          error ? "border-red-500" : "border-slate-300"
        }`}
      >
        <SignatureCanvas
          ref={sigRef}
          penColor="#1e293b"
          canvasProps={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            className: "touch-none w-full",
            style: { height: `${CANVAS_HEIGHT}px` },
            "aria-label": "Draw your signature here",
          }}
          onEnd={commit}
        />
      </div>

      <p className="text-xs text-slate-400">
        Sign above using your mouse, stylus, or finger.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

export default SignaturePad;
