import { useEffect, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import Input from "../../../components/ui/Input";
import VerificationBadge from "./VerificationBadge";
import KYCVerificationCard from "../../verification/components/KYCVerificationCard";

import usePanVerification from "../hooks/usePanVerification";
import useOTPVerification from "../../verification/hooks/useOTPVerification";
import useWizardStore from "../../../store/wizardStore";
import { maskPAN } from "../../../utils/maskPII";


function PanInput() {
  const { control, watch } = useFormContext();

  const {
  panVerified,
  panResult,
  setPanVerified,
  setPanResult,
} = useWizardStore();

//   const setPanVerified = useWizardStore(
//   (state) => state.setPanVerified
//  );

  const panValue = watch("pan");
  const previousPan = useRef("");

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);

  // PAN Verification Hook
  const {
    verify,
    loading,
    error,
    result,
    reset,
  } = usePanVerification();

  // OTP Verification Hook
  const {
  loading: otpLoading,
  error: otpError,
  success,
  startVerification,
  verify: verifyOTP,
  resend,
  reset: resetOTP,
} = useOTPVerification();

const displayResult = panResult || result;

// useEffect(() => {
//   window.panVerified = verified;
// }, [verified]);

// useEffect(() => {
//   setPanVerified(verified);
// }, [verified, setPanVerified]);

  // Countdown Timer
 useEffect(() => {
  if (!displayResult || panVerified) return;
  if (timer === 0) return;

  const interval = setInterval(() => {
    setTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(interval);
}, [timer, displayResult, panVerified]);

  useEffect(() => {
  if (!previousPan.current) {
    previousPan.current = panValue;
    return;
  }

  if (previousPan.current !== panValue) {
    previousPan.current = panValue;

    reset();
    resetOTP();

    setPanVerified(false);
    setPanResult(null);

    setOtp("");
    setTimer(30);
  }
},[ panValue, reset, resetOTP, setPanVerified, setPanResult,]);

  const handleVerifyPan = async () => {
    try {
      const loanType = watch("loanType");
      const response = await verify(panValue, loanType);

      if (response.success) {
     setPanResult(response.data);
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
     setPanVerified(true);
     } catch (err) {
     setOtp("");
     console.error(err);
     }
    };

  return (
    <Controller
      name="pan"
      control={control}
      defaultValue=""
      render={({ field, fieldState }) => (
        <div className="space-y-5">

          {/* PAN Input */}

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <Input
                {...field}
                disabled={panVerified}
                label="PAN Number"
                placeholder="AAAPL1234C"
                autoComplete="off"
                className="uppercase"
                error={fieldState.error?.message}
                onChange={(e) =>
                  field.onChange(
                    e.target.value.toUpperCase()
                  )
                }
              />
            </div>

          {!panVerified && (  
         <button
           type="button"
            disabled={
            loading ||
          !panValue ||
           panValue.length !== 10
      }
         onClick={handleVerifyPan}
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
  verified={panVerified}
  success={success}
  otp={otp}
  setOtp={setOtp}
  otpLoading={otpLoading}
  otpError={otpError}
  timer={timer}
  resend={() => {
    setOtp("");
    resend();
    setTimer(30);
  }}
  handleVerifyOTP={handleVerifyOTP}
  title="PAN"
  documentLabel="PAN"
  documentValue={maskPAN(displayResult?.pan)}
/>
        </div>
      )}
    />
  );
}

export default PanInput;