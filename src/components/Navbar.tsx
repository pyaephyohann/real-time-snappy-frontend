import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuCard from "./MenuCard";
import { Link, useLocation } from "react-router-dom";

type ScrollState = "top" | "mid" | "bottom";

const Navbar: React.FC = () => {
  const [openMenuCard, setOpenMenuCard] = useState(false);

  const [scrollState, setScrollState] = useState<ScrollState>("top");

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;

      if (y > 150) {
        setScrollState("bottom");
      } else if (y > 20) {
        setScrollState("mid");
      } else {
        setScrollState("top");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const location = useLocation();
  const isAuthPageAndPasscodePage =
    location.pathname.includes("auth") ||
    location.pathname.includes("passcode") ||
    location.pathname.includes("verify-email");

  const variants = {
    open: { opacity: 1, scale: 1, y: 20 },
    closed: { opacity: 0, scale: 0.9, y: 0 },
  };

  return (
    <nav
      className={`mx-auto fixed top-0 left-0 right-0 w-full z-50 transition-all px-20 duration-1000 ease-in-out
        ${
          scrollState === "top"
            ? "bg-transparent"
            : scrollState === "mid"
              ? "z-50 backdrop-blur-md bg-black/50 shadow-md"
              : "z-50 backdrop-blur-md bg-black/50 shadow-md"
        }
      `}
    >
      <div className="flex justify-between items-center">
        <Link to={"/home"} className="flex items-center">
          <img src="/logo.png" alt="logo" className="h-[9rem]" />
          <h1 className="text-white font-bold text-[2.7rem] caveat-font">
            Snappy
          </h1>
        </Link>
        {/* hamburger menu */}
        {isAuthPageAndPasscodePage ? (
          <p></p>
        ) : (
          <button
            className="cursor-pointer"
            onClick={() => setOpenMenuCard(!openMenuCard)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-10 text-snap-white"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <div className="absolute z-50 right-[0rem] md:right-[0rem] top-[5rem]">
          <AnimatePresence>
            {openMenuCard && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={variants}
                transition={{ duration: 0.3 }}
              >
                <MenuCard setOpen={setOpenMenuCard} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
