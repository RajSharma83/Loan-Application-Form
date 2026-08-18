import { CheckCircle2, Loader2, XCircle } from "lucide-react";

function VerificationBadge({ loading, verified, error }) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm font-medium">
          Verifying...
        </span>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle2 className="h-4 w-4" />
        <span className="text-sm font-medium">
          Verified
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600">
        <XCircle className="h-4 w-4" />
        <span className="text-sm font-medium">
          {error}
        </span>
      </div>
    );
  }

  return null;
}

export default VerificationBadge;