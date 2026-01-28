import { useEffect, useRef, useState } from "react";

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export default function OTPInput({
  length = 4,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
  className = "",
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) {
      inputsRef.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .slice(0, length)
      .replace(/\D/g, "");

    if (!pasteData) return;

    const newOtp = pasteData.split("");
    while (newOtp.length < length) newOtp.push("");

    setOtp(newOtp);

    const lastIndex = Math.min(pasteData.length - 1, length - 1);
    inputsRef.current[lastIndex]?.focus();

    if (newOtp.every((digit) => digit !== "")) {
      onComplete?.(newOtp.join(""));
    }
  };

  return (
    <div className={`flex gap-3 ${className}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          //@ts-expect-error
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-12 h-12 text-center text-lg font-semibold rounded-lg
            border transition
            ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-pink-400"
            }
            focus:outline-none focus:ring-2
            disabled:bg-gray-100 disabled:cursor-not-allowed`}
        />
      ))}
    </div>
  );
}
