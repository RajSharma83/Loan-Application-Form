import { useState } from "react";
import { verifyAadhaar } from "../services/aadhaarVerification";

function useAadhaarVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const verify = async (aadhaar) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await verifyAadhaar(aadhaar);

      setResult(response.data);

      return response;
    } catch (err) {
      setError(err.message || "Verification failed.");

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError("");
    setResult(null);
  };

  return {
    verify,
    loading,
    error,
    result,
    reset,
  };
}

export default useAadhaarVerification;