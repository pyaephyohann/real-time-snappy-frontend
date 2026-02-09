import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
  showMenuCard: boolean;
}

const FunDeleteMenu = ({ showMenuCard }: Props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const moveRandomly = () => {
    const randomX = Math.floor(Math.random() * 200) - 100; // -100 to 100
    const randomY = Math.floor(Math.random() * 200) - 100;

    setPosition({ x: randomX, y: randomY });
  };

  if (!showMenuCard) return null;

  return (
    <motion.div
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className="absolute top-8 right-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md p-2 flex flex-col gap-2 z-20"
    >
      <button className="flex items-center gap-2 text-white hover:bg-black hover:bg-opacity-20 rounded-md p-1">
        Edit
      </button>

      <button
        onClick={moveRandomly}
        className="flex items-center gap-2 text-white hover:bg-black hover:bg-opacity-20 rounded-md p-1"
      >
        Delete
      </button>
    </motion.div>
  );
};

export default FunDeleteMenu;
