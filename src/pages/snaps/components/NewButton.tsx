import { motion } from "framer-motion";
import Loading from "../../../components/Loading";
import { useRef } from "react";

interface Props {
  title: string;
  buttonClassName?: string;
  isLoading?: boolean;
  lightningDuration?: number;
  isDisabled?: boolean;
  callBack?: () => void;
}

const NewButton = ({
  buttonClassName = "",
  title,
  isLoading,
  lightningDuration = 1.5,
  isDisabled,
  callBack,
}: Props) => {
  const draggedRef = useRef(false);

  return (
    <motion.button
      drag
      dragMomentum={true}
      dragElastic={0.15}
      dragTransition={{
        power: 0.3,
        timeConstant: 300,
        modifyTarget: (target) => target,
      }}
      onDragStart={() => {
        draggedRef.current = false;
      }}
      onDrag={(e, info) => {
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          draggedRef.current = true;
        }
      }}
      onDragEnd={(event, info) => {
        console.log("Throw velocity:", info.velocity);
      }}
      whileTap={{ cursor: "grabbing" }}
      onClick={() => {
        // only run callback if it wasn't dragged
        if (!draggedRef.current) {
          callBack?.();
        }
        // reset for next click
        draggedRef.current = false;
      }}
      className={`
        relative
        w-16 h-16
        rounded-full
        gradient-background
        flex items-center justify-center
        text-white font-semibold
        overflow-hidden
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${buttonClassName}
      `}
    >
      {/* Lightning border */}
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, #fff, transparent 30%)",
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: lightningDuration,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Inner background */}
      <span className="absolute inset-[2px] rounded-full gradient-background" />

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center leading-none text-[3rem]">
        {isLoading ? <Loading size={10} /> : title}
      </span>
    </motion.button>
  );
};

export default NewButton;
