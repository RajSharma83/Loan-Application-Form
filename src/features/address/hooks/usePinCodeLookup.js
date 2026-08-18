import { useCallback, useState } from "react";
import { fetchPinDetails } from "../services/pinCodeService";

function usePinCodeLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [location, setLocation] = useState(null);

  const lookup = useCallback(async (pinCode) => {
    try {
      setLoading(true);
      setError("");

      const data = await fetchPinDetails(pinCode);

      setLocation(data);

      return data;
    } catch (err) {
      setLocation(null);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = () => {
    setLoading(false);
    setError("");
    setLocation(null);
  };

  return {
    lookup,
    loading,
    error,
    location,
    reset,
  };
}

export default usePinCodeLookup;