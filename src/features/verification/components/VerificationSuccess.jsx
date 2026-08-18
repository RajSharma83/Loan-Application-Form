import { CheckCircle2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

function VerificationSuccess({
  title = "Verification Successful",
  subtitle = "Government records matched successfully.",
  name,
  idNumber,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
      }}
      className="neu-surface overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-100"
    >
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-emerald-200/60 bg-white/70 px-6 py-5">
        <div className="skeu-control flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2
            size={30}
            className="text-emerald-600"
          />
        </div>

        <div>
          <h3 className="text-xl font-bold text-emerald-700">
            {title}
          </h3>

          <p className="text-sm text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-4 px-6 py-5">
        {name && (
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">
              Holder Name
            </span>

            <span className="font-semibold text-slate-800">
              {name}
            </span>
          </div>
        )}

        {idNumber && (
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">
              Document
            </span>

            <span className="font-semibold text-slate-800">
              {idNumber}
            </span>
          </div>
        )}

        <div className="neu-inset-shadow flex items-center gap-2 rounded-xl bg-emerald-100 p-3 text-emerald-700">
          <ShieldCheck size={18} />

          <span className="text-sm font-medium">
            Verified against mock government records.
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default VerificationSuccess;