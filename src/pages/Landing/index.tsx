import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../../components/Button";

export default function Landing() {
  return (
    <div className="min-h-screen w-full gradient-background text-white overflow-hidden relative">
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-10">
        <Link to={"/home"} className="flex items-center">
          <img src="/logo.png" alt="logo" className="h-[9rem]" />
          <h1 className="text-white font-bold text-[2.7rem] caveat-font">
            Snappy
          </h1>
        </Link>

        <div className="flex gap-4 items-center">
          <Button title="Login" />
          <button className="relative px-6 py-3 rounded-xl text-white font-semibold backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden">
            {/* Liquid gradient background */}
            <span className="absolute inset-0 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/30"></span>

            {/* Shine layer */}
            <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></span>

            {/* Button content */}
            <span className="relative z-10">Start Snapping</span>
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 px-10 pt-20">
        {/* LEFT CONTENT */}
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl xl:text-6xl font-semibold leading-tight">
            Capture Real Moments
            <br />
            You Never Want to Lose —
            <br />
            <span className="text-white/90">All in One Safe Place</span>
          </h1>

          <p className="mt-6 max-w-lg text-white/80">
            Snappy is a private photo gallery built for your inner circle. Share
            moments with people you trust — protected by 2‑step passcode
            verification.
          </p>

          <button className="mt-10 px-6 py-3 rounded-full bg-black/80 border border-white/20">
            Start Project →
          </button>
        </div>
        {/* RIGHT ANIMATED ORBIT */}
        <div className="relative flex items-center justify-center h-[520px]">
          {/* ORBIT RINGS */}
          {[220, 300, 380].map((size, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute rounded-full border border-white/20"
              style={{ width: size, height: size }}
              animate={{ rotate: 360 }}
              transition={{
                repeat: Infinity,
                duration: 30 + i * 10,
                ease: "linear",
              }}
            />
          ))}

          {/* CENTER STAT */}
          <div className="absolute text-center z-10">
            <p className="text-4xl font-semibold">10k+</p>
            <p className="text-sm opacity-70">Private Memories</p>
          </div>

          {/* ORBITING AVATARS */}
          {[
            { size: 220, duration: 20, rotate: -360 },
            { size: 300, duration: 14, rotate: 369 },
            { size: 380, duration: 10, rotate: -360 },
          ].map((orbit, i) => (
            <motion.div
              key={`avatar-orbit-${i}`}
              className="absolute flex items-center justify-center"
              style={{ width: orbit.size, height: orbit.size }}
              animate={{ rotate: orbit.rotate }}
              transition={{
                repeat: Infinity,
                duration: orbit.duration,
                ease: "linear",
              }}
            >
              {/* Avatar positioned on the orbit */}
              <div className="absolute top-[-24px] left-1/2 -translate-x-1/2">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
