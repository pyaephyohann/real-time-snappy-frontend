import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth/sign-in");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center text-snap-white mt-[15rem]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-10"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500"
        >
          <span className="text-[2rem]">✓</span>
        </motion.div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-semibold"
        >
          Email verified successfully
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-md"
        >
          Redirecting to sign in...
        </motion.p>

        {/* Loader */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="h-8 w-8 rounded-full border-2 border-gray-600 border-t-white"
        />
        <Loading size={15} />
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
