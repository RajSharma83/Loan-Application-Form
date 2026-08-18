import { useState } from "react";

import {
  sendOTP,
  verifyOTP,
  resendOTP,
} from "../services/otpVerification";

function useOTPVerification() {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [verified, setVerified] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const startVerification = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await sendOTP();

      setSuccess(response.message);

      setOpen(true);

      return response;
    } catch (err) {
      setError(err.message || "Unable to send OTP.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (otp) => {
    setLoading(true);
    setError("");

    try {
      const response = await verifyOTP(otp);

      setVerified(true);

      setSuccess(response.message);

      setOpen(false);

      return response;
    } catch (err) {
      setError(err.message || "Invalid OTP.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await resendOTP();

      setSuccess(response.message);

      return response;
    } catch (err) {
      setError(err.message || "Unable to resend OTP.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setOpen(false);
    setError("");
  };

  const reset = () => {
    setOpen(false);

    setLoading(false);

    setVerified(false);

    setSuccess("");

    setError("");
  };

  return {
    open,
    loading,
    verified,
    success,
    error,

    startVerification,
    verify,
    resend,

    close,
    reset,
  };
}

export default useOTPVerification;