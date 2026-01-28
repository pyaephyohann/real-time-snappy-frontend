import { useCallback, useEffect, useState } from "react";
import OTPInput from "../../components/OTPInput";
import { config } from "../../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Passcode = () => {
  const logInToken = localStorage.getItem("logInToken");
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();

  // verify passcode
  const handleComplete = async (code: string) => {
    setIsVerifying(true);
    const inputPasscode = Number(code);
    const response = await fetch(`${config.apiBaseUrl}/passcode/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${logInToken}`,
      },
      body: JSON.stringify({ code: inputPasscode }),
    });
    if (response.ok) {
      const responseJson = await response.json();
      const currentUser = responseJson.user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      navigate("/home");
    }
    setIsVerifying(false);
  };

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
        toast("Error getting passcode! Please try login again!");
        return;
      }

      const responseJson = await response.json();
      toast(`Here is your code: ${responseJson.passcode}`);
    } catch (error) {
      console.error("Failed to get passcode:", error);
      toast("Something went wrong. Please try again.");
    }
  }, [logInToken]);

  useEffect(() => {
    handleGetPasscode();
  }, [handleGetPasscode]);

  return (
    <div>
      <h1 className="text-[3rem] mt-[12rem] font-bold text-snap-white text-center">
        Enter Your Passcode!
      </h1>
      <div className="mt-[5rem] flex items-center justify-center">
        <OTPInput length={4} onComplete={handleComplete} error={false} />
      </div>
      <div className="flex justify-center my-[2rem]">
        <Button
          isLoading={isVerifying}
          isDisabled={isVerifying}
          buttonClassName="w-[15rem]"
          title="Verify Now"
        />
      </div>
      <div className="text-center mt-[4rem]">
        <p className="mb-[1.5rem]">Didn't get the Passcode?</p>
        <button
          onClick={() => window.location.reload()}
          className="text-snap-white font-semibold text-[1rem] underline"
        >
          Re-load
        </button>
        {/* <Button title="Resend" /> */}
      </div>
      -
    </div>
  );
};

export default Passcode;
