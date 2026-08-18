import { useForm } from "react-hook-form";

export default function useLoanForm(options = {}) {
  return useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    shouldFocusError: true,
    ...options,
  });
}