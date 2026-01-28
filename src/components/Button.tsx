import React from "react";
import Loading from "./Loading";
import { motion } from "framer-motion";

interface Props {
  title: string;
  buttonClassName?: string;
  isLoading?: boolean;
  lightningDuration?: number;
  isDisabled?: boolean;
  callBack?: () => void;
}

const Button = ({
  buttonClassName,
  title,
  isLoading,
  lightningDuration,
  isDisabled,
  callBack,
}: Props) => {
  return (
    <div>
      <button
        disabled={isDisabled}
        onClick={callBack}
        type="submit"
        className={`relative px-8 py-3 rounded-xl gradient-background ${
          isDisabled ? "opacity-50" : ""
        } text-white font-semibold overflow-hidden ${buttonClassName}`}
      >
        {/* Lightning border */}
        <motion.span
          className="absolute inset-0 rounded-xl"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, #fff, transparent 30%)",
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: lightningDuration ? lightningDuration : 1.5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner background (covers center) */}
        <span className="absolute inset-[2px] rounded-xl gradient-background" />

        {/* Button text */}
        <span className="relative z-10">
          {isLoading ? <Loading size={10} /> : <span>{title}</span>}
        </span>
      </button>
    </div>
  );
};

export default Button;
