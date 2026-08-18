import { useCallback, useState } from "react";
import {
  sendOTP,
  verifyOTP,
} from "../services/mobileVerification";

function useMobileVerification() {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async (mobile, countryCode) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await sendOTP(mobile, countryCode);

      setOtpSent(true);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await verifyOTP(otp);

      setVerified(true);
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetVerification = useCallback(() => {
    setOtpSent(false);
    setVerified(false);
    setError("");
    setSuccess("");
  }, []);

  return {
    loading,
    otpSent,
    verified,
    error,
    success,

    sendOTP: handleSendOTP,
    verifyOTP: handleVerifyOTP,
    resetVerification,
  };
}

export default useMobileVerification;