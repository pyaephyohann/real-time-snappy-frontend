import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import OTPInput from "../../components/OTPInput";
import Button from "../../components/Button";
import { config } from "../../config";
import Metadata from "../../components/Metadata";

const Passcode = () => {
  const navigate = useNavigate();
  const logInToken = localStorage.getItem("logInToken");

  const [isVerifying, setIsVerifying] = useState(false);

  // Verify passcode
  const handleComplete = async (code: string) => {
    if (!logInToken) return;

    try {
      setIsVerifying(true);

      const response = await fetch(`${config.apiBaseUrl}/passcode/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logInToken}`,
        },
        body: JSON.stringify({ code: Number(code) }),
      });

      if (!response.ok) {
        throw new Error("Invalid passcode");
      }

      const responseJson = await response.json();
      localStorage.setItem("currentUser", JSON.stringify(responseJson.user));

      toast.success("Verified successfully 🔓");
      navigate("/home");
    } catch (error: any) {
      toast.error(error.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate passcode
  const handleGetPasscode = useCallback(async () => {
    if (!logInToken) return;

    try {
      const response = await fetch(`${config.apiBaseUrl}/passcode/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logInToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error getting passcode. Please login again.");
      }

      const responseJson = await response.json();
      toast(`Your passcode is: ${responseJson.passcode}`);
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  }, [logInToken]);

  useEffect(() => {
    handleGetPasscode();
  }, [handleGetPasscode]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-snap-bg">
      <Metadata title="Snappy | Passcode Verification" />

      <div
        className="
          w-full
          max-w-sm
          sm:max-w-md
          bg-white
          p-6 sm:p-8
          rounded-2xl
          shadow-lg
          text-center
        "
      >
        <h1
          className="
            text-2xl
            sm:text-3xl
            font-bold
            gradient-color
            mb-4
            font-caveat-font
          "
        >
          Enter Your Passcode
        </h1>

        <p className="text-sm sm:text-base text-gray-500 mb-8">
          We’ve sent a 4-digit passcode to you. Please enter it below.
        </p>

        {/* OTP Input */}
        <div className="flex justify-center mb-8">
          <OTPInput length={4} onComplete={handleComplete} error={false} />
        </div>

        {/* Verify Button */}
        <Button
          title="Verify Now"
          isLoading={isVerifying}
          isDisabled={isVerifying}
          buttonClassName="w-full py-2.5 sm:py-3"
        />

        {/* Resend Section */}
        <div className="mt-8">
          <p className="text-sm mb-2 text-gray-600">Didn’t get the passcode?</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm sm:text-base font-semibold underline text-snap-black"
          >
            Re-send Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default Passcode;
