import { useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, Variants } from "framer-motion";
import { toast } from "react-toastify";

import { friendDatas } from "../../utils/datas";
import Metadata from "../../components/Metadata";
import SnapCard from "./components/SnapCard";
import NewImage from "./components/NewImage";
import { config } from "../../config";
import NewButton from "./components/NewButton";
import ThoughtBubble from "../../components/ThoughtBubble";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const Snaps = () => {
  const { userId } = useParams();
  const [openNewImage, setOpenNewImage] = useState(false);
  const [currentUsersSnaps, setCurrentUsersSnaps] = useState<any[]>([]);
  const [showButtonFunMessage, setShowButtonFunMessage] = useState(false);

  const lastScrollY = useRef(0);
  const loginToken = localStorage.getItem("logInToken");

  const currentUser = friendDatas.find(
    (friend) => friend.id === Number(userId),
  );

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetAllImagesByUserId = useCallback(async () => {
    if (!loginToken) return;

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/users/${userId}/images`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${loginToken}`,
          },
        },
      );

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson?.message || "Failed to load snaps");
      }

      setCurrentUsersSnaps(responseJson.datas.data);
    } catch (error: any) {
      // silent fail
    }
  }, [loginToken, userId]);

  useEffect(() => {
    handleGetAllImagesByUserId();
  }, [handleGetAllImagesByUserId]);

  const handleImageUpload = async () => {
    if (!loginToken) {
      toast.error("Please sign in to upload images");
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/images/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginToken}`,
        },
        body: JSON.stringify({}),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Image upload failed");
      }

      toast.success("Image uploaded successfully 📸");
      handleGetAllImagesByUserId();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-2xl sm:text-3xl font-semibold text-snap-white text-center font-caveat-font">
          Oops! <br /> User Not Found!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 pt-6 pb-24">
      <Metadata title={`${currentUser.name}'s Snaps`} />

      {/* Floating Add Button */}
      <div
        className="
        fixed
        bottom-6 right-6
        sm:bottom-8 sm:right-8
        z-50
      "
      >
        <div className="absolute top-0 right-0">
          <ThoughtBubble text="You can drag and play  >_<" />
        </div>
        <NewButton
          title="+"
          callBack={() =>
            loginToken
              ? setOpenNewImage(true)
              : toast.error("Please sign in to upload")
          }
        />
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={currentUser.url}
          alt={currentUser.name}
          className="
            w-24 h-24
            sm:w-28 sm:h-28
            lg:w-32 lg:h-32
            rounded-full
            object-cover
            mb-4
          "
        />
        <h2
          className="
          text-lg
          sm:text-xl
          lg:text-2xl
          font-semibold
          text-snap-white
          text-center
        "
        >
          {currentUser.name}
        </h2>
      </div>

      {/* Snaps Grid */}
      {!currentUsersSnaps.length ? (
        <p
          className="
          text-center
          text-xl sm:text-2xl
          font-bold
          mt-16
          text-snap-white
          opacity-70
        "
        >
          No snaps yet 📭
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ amount: 0.2 }}
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-6
            justify-center
          "
        >
          {currentUsersSnaps.map((snap) => (
            <div key={snap.id} className="flex justify-center">
              <SnapCard
                id={snap.id}
                url={snap.url}
                caption={snap.caption}
                uploadedBy={snap.uploaded_by}
              />
            </div>
          ))}
        </motion.div>
      )}

      {/* Upload Modal */}
      <NewImage
        open={openNewImage}
        setOpen={setOpenNewImage}
        title="Upload New Image"
        callBack={handleImageUpload}
        getAllImagesByUserId={handleGetAllImagesByUserId}
      />
    </div>
  );
};

export default Snaps;
