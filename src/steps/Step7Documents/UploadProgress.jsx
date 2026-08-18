function UploadProgress({ progress, label = "Uploading" }) {
  return (
    <div
      className="space-y-1.5"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span>{label}...</span>
        <span>{Math.round(progress)}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default UploadProgress;
