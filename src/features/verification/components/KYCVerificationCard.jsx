import OTPInput from "./OTPInput";
import VerificationSuccess from "../components/VerificationSuccess";

function KYCVerificationCard({
  result,
  verified,
  success,
  otp,
  setOtp,
  otpLoading,
  otpError,
  timer,
  resend,
  handleVerifyOTP,
  title,
  documentLabel,
  documentValue,
}) {
  if (verified) {
    return (
      <VerificationSuccess
        title={`${title} Verified Successfully`}
        subtitle={success}
        name={result?.holderName}
        idNumber={documentValue}
      />
    );
  }

  if (!result) return null;

  return (
    <div className="glass-panel rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-indigo-700">
        ✅ {title} Validated
      </h3>

      <div className="mt-3 space-y-2 text-sm text-slate-700">
        <p>
          <strong>Name:</strong> {result.holderName}
        </p>

        <p>
          <strong>{documentLabel}:</strong> {documentValue}
        </p>

        <p>
          <strong>Mobile:</strong> {result.maskedMobile}
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-3 font-medium text-indigo-700">
          Enter OTP
        </p>

        <OTPInput value={otp} onChange={setOtp} />
      </div>

      {otpError && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {otpError}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleVerifyOTP}
          disabled={otpLoading || otp.length !== 6}
          className="skeu-btn-filled min-h-11 rounded-xl bg-emerald-600 px-5 py-3 font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {otpLoading ? "Verifying OTP..." : "Verify OTP"}
        </button>

        <button
          type="button"
          disabled={timer > 0}
          onClick={() => {
            setOtp("");
            resend();
          }}
          className="skeu-btn min-h-11 rounded-xl bg-white px-5 py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {timer > 0
            ? `Resend OTP (${timer}s)`
            : "Resend OTP"}
        </button>
      </div>
    </div>
  );
}

export default KYCVerificationCard;