import { useEffect, useMemo } from "react";
import { FileText, Image as ImageIcon, X } from "lucide-react";

function formatSize(bytes) {
  if (!bytes && bytes !== 0) return "";
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Shows the uploaded file: an image thumbnail (object URL, properly
 * revoked on cleanup to avoid leaking memory) or a PDF file card, plus
 * compression stats when available.
 */
function DocumentPreview({ file, compressionInfo, onRemove }) {
  const isImage = file?.type?.startsWith("image/");

  // Object URLs are a side effect of `file`, not independent state — a
  // memo avoids the "setState in effect" anti-pattern while a
  // cleanup-only effect still guarantees each URL gets revoked.
  const previewUrl = useMemo(() => {
    if (!isImage || !file) return null;
    return URL.createObjectURL(file);
  }, [file, isImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!file) return null;

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {isImage ? (
            <ImageIcon className="shrink-0 text-emerald-600" size={24} />
          ) : (
            <FileText className="shrink-0 text-red-600" size={24} />
          )}

          <div className="min-w-0">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-sm text-slate-500">{formatSize(file.size)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${file.name}`}
          className="skeu-control flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
        >
          <X size={18} className="text-red-600" />
        </button>
      </div>

      {isImage && previewUrl && (
        <img
          src={previewUrl}
          alt={`Preview of ${file.name}`}
          className="mt-4 h-48 w-full rounded-xl object-cover"
        />
      )}

      {compressionInfo?.reduced && (
        <p className="mt-3 text-xs font-medium text-emerald-700">
          Compressed {formatSize(compressionInfo.originalSize)} →{" "}
          {formatSize(compressionInfo.compressedSize)} (
          {Math.round(
            (1 - compressionInfo.compressedSize / compressionInfo.originalSize) *
              100
          )}
          % smaller)
        </p>
      )}
    </div>
  );
}

export default DocumentPreview;
