import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

function MobileVerificationBadge({
  loading,
  verified,
  success,
  error,
}) {
  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        Sending OTP...
      </div>
    );
  }

  if (verified) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm font-medium text-green-600">
        <CheckCircle className="h-4 w-4" />
        Mobile Verified
      </div>
    );
  }

  if (success) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        {success}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  return null;
}

export default MobileVerificationBadge;