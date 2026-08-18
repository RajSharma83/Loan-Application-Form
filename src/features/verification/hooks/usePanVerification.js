import { useState } from "react";
import { verifyPan } from "../services/panVerification";

function usePanVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const verify = async (pan, loanType) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await verifyPan(pan, loanType);

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

export default usePanVerification;