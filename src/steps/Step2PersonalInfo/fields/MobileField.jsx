import { useEffect, useState } from "react";
import {
  Controller,
  useFormContext,
  useWatch,
} from "react-hook-form";

import Input from "../../../components/ui/Input";
import countryCodes from "../../../constants/countryCodes";

import useMobileVerification from "../../../features/verification/hooks/useMobileVerification";
import MobileVerificationBadge from "../../../features/verification/components/MobileVerificationBadge";
import OTPInput from "../../../features/verification/components/OTPInput";

function MobileField() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const mobile = useWatch({
    control,
    name: "mobile",
  });

  const countryCode = useWatch({
    control,
    name: "countryCode",
  });

  const {
    loading,
    otpSent,
    verified,
    success,
    error,
    sendOTP,
    verifyOTP,
    resetVerification,
  } = useMobileVerification();

  const [otp, setOtp] = useState("");

  useEffect(() => {
    resetVerification();
  }, [mobile, countryCode, resetVerification]);

  const formatMobile = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);

    if (digits.length <= 5) return digits;

    return `${digits.slice(0, 5)} ${digits.slice(5)}`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-700">
        Mobile Number
        <span className="ml-1 text-red-500">*</span>
      </label>

      <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
        {/* Country Code */}
        <Controller
          name="countryCode"
          control={control}
          defaultValue="+91"
          render={({ field }) => (
            <select
              {...field}
              aria-label="Country code"
              className="cursor-pointer border-r border-slate-300 bg-slate-50 px-3 outline-none"
            >
              {countryCodes.map((country) => (
                <option
                  key={`${country.code}-${country.name}`}
                  value={country.code}
                >
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
          )}
        />

        {/* Mobile Input */}
        <div className="flex flex-1 items-center">
          <Controller
            name="mobile"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Input
                {...field}
                value={formatMobile(field.value ?? "")}
                placeholder="98765 43210"
                inputMode="numeric"
                autoComplete="tel-national"
                className="flex-1 border-0 rounded-none shadow-none focus:ring-0 focus:border-0"
                error={null}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);

                  field.onChange(digits);
                }}
              />
            )}
          />

          {/* Verify Button */}
          <button
            type="button"
            onClick={() => {
              setOtp("");
              sendOTP(mobile, countryCode);
            }}
            disabled={
              loading ||
              verified ||
              !mobile ||
              mobile.length !== 10
            }
            className="mr-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {verified ? "Verified" : "Verify"}
          </button>
        </div>
      </div>

      {/* Validation Error */}
      {errors.mobile && (
        <p className="text-sm text-red-500">
          {errors.mobile.message}
        </p>
      )}

      {/* Ready Status */}
      {!errors.mobile &&
        mobile?.length === 10 &&
        !verified &&
        !otpSent && (
          <p className="text-sm font-medium text-orange-300">
            📱 Ready for OTP Verification
          </p>
        )}

      {/* Verification Status */}
      <MobileVerificationBadge
        loading={loading}
        verified={verified}
        success={success}
        error={error}
      />

      {/* OTP Entry */}
      {otpSent && !verified && (
        <div className="glass-panel mt-4 space-y-3 rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-indigo-700">
            Enter the 6-digit OTP sent to {countryCode} {mobile}
          </p>

          <OTPInput length={6} value={otp} onChange={setOtp} />

          <button
            type="button"
            onClick={() => verifyOTP(otp)}
            disabled={loading || otp.length !== 6}
            className="skeu-btn-filled min-h-11 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      )}
    </div>
  );
}

export default MobileField;