import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../../components/Loading";
import { useRef, useState, useEffect } from "react";
import ThoughtBubble from "../../../components/ThoughtBubble";

interface Props {
  buttonClassName?: string;
  title: string;
  isLoading?: boolean;
  lightningDuration?: number;
  isDisabled?: boolean;
  callBack: () => void;
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
  const [hovering, setHovering] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  // bubble loop: 2s show / 5s hide
  useEffect(() => {
    if (!hovering) {
      setShowBubble(false);
      return;
    }

    let showTimer: NodeJS.Timeout;
    let hideTimer: NodeJS.Timeout;

    const loop = () => {
      setShowBubble(true);

      showTimer = setTimeout(() => {
        setShowBubble(false);
      }, 2000);

      hideTimer = setTimeout(() => {
        loop();
      }, 7000);
    };

    loop();

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hovering]);

  return (
    <motion.button
      drag
      dragMomentum
      dragElastic={0.15}
      dragTransition={{
        power: 0.3,
        timeConstant: 300,
      }}
      onHoverStart={() => setHovering(true)}
      onHoverEnd={() => setHovering(false)}
      onDragStart={() => {
        draggedRef.current = false;
      }}
      onDrag={(e, info) => {
        if (Math.abs(info.offset.x) > 5 || Math.abs(info.offset.y) > 5) {
          draggedRef.current = true;
        }
      }}
      whileTap={{ cursor: "grabbing" }}
      onClick={() => {
        if (!draggedRef.current) {
          callBack?.();
        }
        draggedRef.current = false;
      }}
      className={`
        relative
        w-16 h-16
        rounded-full
        gradient-background
        flex items-center justify-center
        text-white font-semibold
        overflow-visible
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${buttonClassName}
      `}
    >
      {/* Thought bubble */}
      <AnimatePresence>
        {showBubble && (
          <motion.div
            className="absolute -top-[7rem] -right-[2rem] translate-x-1/2 pointer-events-none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3 }}
          >
            <div className="animate-float">
              <ThoughtBubble text="You can drag and play >_<" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
