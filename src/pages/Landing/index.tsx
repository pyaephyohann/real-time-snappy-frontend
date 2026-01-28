import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* Nav Bar */}
      <div className="flex justify-between w-[80%] mx-auto">
        <Link to={"/home"} className="flex items-center">
          <img src="/logo.png" alt="logo" className="h-[9rem]" />
          <h1 className="text-white font-bold text-[2.7rem] caveat-font">
            Snappy
          </h1>
        </Link>
        <div className="flex justify-between items-center gap-10">
          <button className="text-white font-semibold">Sign In</button>
          <Button title="Sign Up" />
        </div>
      </div>

      <h2 className="rounded-[2rem] mt-[3rem] mx-auto text-[0.8rem] w-fit bg-snap-black py-[0.5rem] px-[1rem] text-snap-white">
        PRIVATE GALLERY
      </h2>

      <h1 className="text-white text-[4rem] font-semibold text-center my-[1rem]">
        Snappy
      </h1>
      <p className="text-snap-white opacity-80 font-semibold text-[1.2rem] w-[50%] text-center mx-auto mt-[2rem]">
        A secure space to capture and share moments with your inner circle.
        Upload snapshots of your friends and keep your favourite memories
        protected behind our{" "}
        <span className="text-snap-black">2-step passcode verification.</span>
      </p>
      <div className="w-fit mx-auto flex justify-center items-center gap-[3rem] mt-[3rem]">
        <Button
          callBack={() => navigate("/auth/sign-up")}
          title="Start Snapping"
        />
        <button className="px-8 py-3 rounded-xl ext-white font-semibold text-snap-black text-opacity-70 bg-snap-white">
          View Memories
        </button>
      </div>
      <p className="text-center text-snap-white font-medium mt-[2rem]">
        Let's make super beautiful memories.
      </p>
    </div>
  );
};

export default Landing;
