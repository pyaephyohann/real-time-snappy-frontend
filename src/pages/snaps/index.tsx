import { useParams } from "react-router-dom";
import { friendDatas } from "../../utils/datas";
import Button from "../../components/Button";
import NewImage from "./components/NewImage";
import { useCallback, useState } from "react";
import { config } from "../../config";
import Metadata from "../../components/Metadata";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import SnapCard from "./components/SnapCard";

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: ({
    direction,
    depth,
  }: {
    direction: "up" | "down";
    depth: number;
  }) => ({
    opacity: 0,
    y: direction === "down" ? depth : -depth,
    scale: 0.9,
  }),

  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: "easeOut" as const,
    },
  },
};

const Snaps = () => {
  const [openNewImage, setOpenNewImage] = useState<boolean>(false);
  const { userId } = useParams();
  const [currentUsersSnaps, setCurrentUsersSnaps] = useState<any[]>([]);

  const lastScrollY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      if (Math.abs(currentScrollY - lastScrollY.current) < 10) return;

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentUser = friendDatas.find(
    (friend) => friend.id === Number(userId),
  );

  const loginToken = localStorage.getItem("logInToken");

  const handleImageUpload = async () => {
    await fetch(`${config.apiBaseUrl}/images/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${loginToken}`,
      },
      body: JSON.stringify({}),
    });
  };

  const handleGetAllImagesByUserId = useCallback(async () => {
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
      setCurrentUsersSnaps(responseJson.datas.data);
    } catch (error) {
      return alert("Error getting images!");
    }
  }, [loginToken, userId]);

  useEffect(() => {
    handleGetAllImagesByUserId();
  }, [handleGetAllImagesByUserId]);

  if (!currentUser)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[3rem] font-semibold text-snap-white caveat-font text-center">
          Oops! <br /> User Not Found!
        </p>
      </div>
    );

  return (
    <div className="mt-[1.5rem]">
      <Metadata title={`${currentUser.name}'s Snaps`} />

      <div className="fixed right-20 top-[10rem]">
        <Button callBack={() => setOpenNewImage(true)} title="+ Add New" />
      </div>

      {/* Profile */}
      <div className="w-fit mx-auto">
        <img
          className="w-[8rem] h-[8rem] object-cover rounded-full"
          src={currentUser.url}
          alt={currentUser.name}
        />
        <h2 className="text-[1.5rem] text-snap-white font-semibold text-center mt-[1rem]">
          {currentUser.name}
        </h2>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.2 }}
        className="grid grid-cols-[repeat(auto-fit,15rem)] justify-center gap-8 mt-[3rem]"
      >
        {currentUsersSnaps.map((snap, index) => (
          <motion.div
            variants={itemVariants}
            custom={{
              direction: scrollDirection,
              depth: 60,
            }}
            key={snap.id}
            className="my-[2rem]"
          >
            <SnapCard
              id={snap.id}
              url={snap.url}
              caption={snap.caption}
              uploadedBy={snap.uploaded_by}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-center mb-[5rem]">
        <SnapCard
          id={1}
          url="https://i.pinimg.com/474x/3e/79/2f/3e792f2f83eeec7745a6f1862567c5e7.jpg"
          caption="Developer Cat"
          uploadedBy={{
            id: 1,
            name: "Ko Kyaw Gyi",
            avatar_url:
              "https://i.pinimg.com/736x/62/6b/91/626b91460049992c732ae71917de14ed.jpg",
          }}
        />
      </div>

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
