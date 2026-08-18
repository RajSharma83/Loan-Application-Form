import { useRef } from "react";

function OTPInput({
  length = 6,
  value = "",
  onChange,
}) {
  const inputRefs = useRef([]);

  const otp = Array.from(
    { length },
    (_, i) => value[i] || ""
  );

  const handleChange = (index, e) => {
    const digit = e.target.value.replace(/\D/g, "").slice(-1);

    const updated = [...otp];
    updated[index] = digit;

    onChange(updated.join(""));

    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const updated = [...otp];
        updated[index] = "";
        onChange(updated.join(""));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    onChange(pasted);

    inputRefs.current[
      Math.min(pasted.length, length - 1)
    ]?.focus();
  };

  return (
    <div
      className="flex justify-center gap-3"
      onPaste={handlePaste}
      role="group"
      aria-label="One-time password"
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          aria-label={`OTP digit ${index + 1} of ${length}`}
          className="neu-inset h-14 w-14 rounded-xl text-center text-xl font-semibold text-slate-800 outline-none"
        />
      ))}
    </div>
  );
}

export default OTPInput;