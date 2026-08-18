import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";
import VerificationBadge from "./VerificationBadge";
import KYCVerificationCard from "../../verification/components/KYCVerificationCard";

import useAadhaarVerification from "../hooks/useAadhaarVerification";
import useOTPVerification from "../../verification/hooks/useOTPVerification";
import useWizardStore from "../../../store/wizardStore";
import { maskAadhaar } from "../../../utils/maskPII";

function AadhaarInput() {
  const { control, watch } = useFormContext();

  const {
  aadhaarVerified,
  aadhaarResult,
  setAadhaarVerified,
  setAadhaarResult,
} = useWizardStore();

  const aadhaarValue = watch("aadhaar");

  const previousAadhaar = useRef("");

  const [otp, setOtp] = useState("");

  const [timer, setTimer] = useState(30);

  const {
    verify,
    loading,
    error,
    result,
    reset,
  } = useAadhaarVerification();

  const {
  loading: otpLoading,
  error: otpError,
  success,
  startVerification,
  verify: verifyOTP,
  resend,
  reset: resetOTP,
} = useOTPVerification();

const displayResult = aadhaarResult || result;

//   useEffect(() => {
//   window.aadhaarVerified = verified;
// }, [verified]);

  useEffect(() => {
   if (!displayResult || aadhaarVerified) return;
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, displayResult, aadhaarVerified]);

  useEffect(() => {
    if (!previousAadhaar.current) {
      previousAadhaar.current = aadhaarValue;
      return;
    }

    if (previousAadhaar.current !== aadhaarValue) {
      previousAadhaar.current = aadhaarValue;

      reset();
     resetOTP();

     setAadhaarVerified(false);
     setAadhaarResult(null);
     setOtp("");
     setTimer(30);
    }
  }, [ aadhaarValue, reset, resetOTP, setAadhaarVerified, setAadhaarResult,]);

  const handleVerifyAadhaar = async () => {
    try {
      const response = await verify(aadhaarValue);

     if (response.success) {
     setAadhaarResult(response.data);
     setTimer(30);
     await startVerification();
}
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await verifyOTP(otp);
      setAadhaarVerified(true);
    } catch (err) {
      setOtp("");
      console.error(err);
    }
  };

  return (
    <Controller
      name="aadhaar"
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <div className="space-y-5">

          <div className="flex items-end gap-3">

            <div className="flex-1">

              <Input
                {...field}
               disabled={aadhaarVerified}
                label="Aadhaar Number"
                placeholder="123456789012"
                error={fieldState.error?.message}
              />

            </div>

           {!aadhaarVerified && (
              <button
                type="button"
                disabled={
                  loading ||
                  !aadhaarValue ||
                  aadhaarValue.replace(/\s/g, "").length !== 12
                }
                onClick={handleVerifyAadhaar}
                className="rounded-xl bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            )}

          </div>

          <VerificationBadge
            loading={loading}
            verified={false}
            error={error}
          />

          <KYCVerificationCard
            result={displayResult}
            verified={aadhaarVerified}
            success={success}
            otp={otp}
            setOtp={setOtp}
            otpLoading={otpLoading}
            otpError={otpError}
            timer={timer}
            resend={async () => {
              setOtp("");
              await resend();
              setTimer(30);
            }}
            handleVerifyOTP={handleVerifyOTP}
            title="Aadhaar"
            documentLabel="Aadhaar"
            documentValue={maskAadhaar(displayResult?.aadhaar)}
          />

        </div>
      )}
    />
  );
}

export default AadhaarInput;