import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import getDocumentConfig from "./documentConfig";
import DocumentUploadCard from "./DocumentUploadCard";
import SignaturePad from "./SignaturePad";
import useWizardStore from "../../store/wizardStore";

function Step7Documents() {
  const { watch, setValue } = useFormContext();
  const loanType = watch("loanType");
  const employmentType = watch("employmentType");
  const panVerified = useWizardStore((state) => state.panVerified);

  // panVerified lives in the Zustand wizard store, not as an RHF
  // field — mirror it into the form so the Zod resolver (which only
  // ever sees getValues(), not Zustand state) can apply the "PAN copy
  // optional once verified" cross-step rule in documents.schema.js.
  useEffect(() => {
    setValue("panVerified", panVerified, { shouldValidate: false });
  }, [panVerified, setValue]);

  const documentConfig = getDocumentConfig({
    loanType,
    employmentType,
    panVerified,
  });

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Upload Documents
        </h2>

        <p className="mt-2 text-slate-500">
          Upload the required documents for verification.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {documentConfig.map((document) => (
          <DocumentUploadCard
            key={document.name}
            {...document}
          />
        ))}
      </div>

      <div className="border-t border-slate-200 pt-8">
        <h3 className="mb-1 text-lg font-semibold text-slate-900">
          E-Signature
        </h3>

        <p className="mb-4 text-sm text-slate-500">
          Your signature will appear on the final application for review.
        </p>

        <SignaturePad />
      </div>
    </div>
  );
}

export default Step7Documents;
