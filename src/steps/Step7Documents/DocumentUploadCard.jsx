import { useCallback, useEffect, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { AlertCircle, Upload } from "lucide-react";

import useDocumentUpload from "../../hooks/useDocumentUpload";
import DocumentPreview from "./DocumentPreview";
import UploadProgress from "./UploadProgress";

const EXTENSION_BY_TYPE = {
  "application/pdf": [".pdf"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

const FORMAT_LABEL_BY_TYPE = {
  "application/pdf": "PDF",
  "image/jpeg": "JPG",
  "image/png": "PNG",
};

function DocumentUploadCard({
  name,
  title,
  required = false,
  maxSizeMB = 5,
  acceptedTypes = ["image/jpeg", "image/png", "application/pdf"],
}) {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={undefined}
      render={({ field }) => (
        <DocumentUploadCardInner
          field={field}
          setValue={setValue}
          name={name}
          title={title}
          required={required}
          maxSizeMB={maxSizeMB}
          acceptedTypes={acceptedTypes}
          schemaError={errors[name]?.message}
        />
      )}
    />
  );
}

function DocumentUploadCardInner({
  field,
  setValue,
  name,
  title,
  required,
  maxSizeMB,
  acceptedTypes,
  schemaError,
}) {
  const file = field.value;

  const commitFile = useCallback(
    (finalFile) => {
      setValue(name, finalFile, { shouldValidate: true });
    },
    [setValue, name]
  );

  const { status, progress, error, compressionInfo, handleFile, reset, reportError } =
    useDocumentUpload({ onComplete: commitFile, maxSizeMB, acceptedTypes });

  // If the field is cleared elsewhere (e.g. form reset on submit / start
  // fresh), keep the upload UI's internal state in sync.
  useEffect(() => {
    if (!file) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const formatsLabel = useMemo(
    () =>
      acceptedTypes
        .map((t) => FORMAT_LABEL_BY_TYPE[t] ?? t)
        .join(", "),
    [acceptedTypes]
  );

  const dropzoneAccept = useMemo(() => {
    const accept = {};
    acceptedTypes.forEach((type) => {
      accept[type] = EXTENSION_BY_TYPE[type] ?? [];
    });
    return accept;
  }, [acceptedTypes]);

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles?.length > 0) {
        const rejection = rejectedFiles[0];
        const isSizeError = rejection.errors?.some(
          (e) => e.code === "file-too-large"
        );

        reportError(
          isSizeError
            ? `File is too large. Maximum size is ${maxSizeMB}MB.`
            : `Only ${formatsLabel} files are allowed.`
        );
        return;
      }

      const selected = acceptedFiles?.[0];
      if (selected) handleFile(selected);
    },
    [handleFile, reportError, maxSizeMB, formatsLabel]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: dropzoneAccept,
    maxSize: maxSizeMB * 1024 * 1024,
    multiple: false,
    disabled: status === "compressing" || status === "uploading",
  });

  const handleRemove = () => {
    setValue(name, undefined, { shouldValidate: true });
    reset();
  };

  const isBusy = status === "compressing" || status === "uploading";
  const displayError = error || (status === "idle" ? schemaError : null);

  return (
    <div className="neu-surface rounded-2xl bg-white p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">
          {title}
          {required && <span className="ml-1 text-red-500">*</span>}
          {!required && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              (Optional)
            </span>
          )}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {formatsLabel} (Max {maxSizeMB}MB)
        </p>
      </div>

      {!file && !isBusy && (
        <div
          {...getRootProps()}
          className={`skeu-control flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-white p-6 transition-colors focus-within:ring-4 focus-within:ring-indigo-100 sm:p-8 ${
            isDragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 hover:border-indigo-500 hover:bg-indigo-50"
          }`}
        >
          <input
            {...getInputProps()}
            aria-label={`Upload ${title}`}
          />

          <Upload size={36} className="text-indigo-600" />

          <p className="mt-3 font-medium">
            {isDragActive ? "Drop the file here" : "Click to upload"}
          </p>

          <p className="text-sm text-slate-500">or drag & drop</p>
        </div>
      )}

      {isBusy && (
        <div className="neu-inset rounded-xl p-4">
          <UploadProgress
            progress={status === "compressing" ? 15 : progress}
            label={status === "compressing" ? "Compressing image" : "Uploading"}
          />
        </div>
      )}

      {file && status === "done" && (
        <DocumentPreview
          file={file}
          compressionInfo={compressionInfo}
          onRemove={handleRemove}
        />
      )}

      {displayError && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-1.5 text-sm text-red-500"
        >
          <AlertCircle size={14} className="shrink-0" />
          {displayError}
        </p>
      )}
    </div>
  );
}

export default DocumentUploadCard;
