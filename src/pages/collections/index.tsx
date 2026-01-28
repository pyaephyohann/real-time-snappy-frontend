import { useCallback, useState } from "react";
import { config } from "../../config";
import Metadata from "../../components/Metadata";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef } from "react";

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

const Collections = () => {
  const lastScrollY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down");

  const [collections, setCollections] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logInToken = localStorage.getItem("logInToken");

  const handleGetAllCollections = useCallback(async () => {
    try {
      const response = await fetch(`${config.apiBaseUrl}/categories`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${logInToken}`,
        },
      });

      const responseJson = await response.json();
      setCollections(responseJson.data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  }, [logInToken]);

  useEffect(() => {
    handleGetAllCollections();
  }, [handleGetAllCollections]);

  return (
    <div className="mt-[1.5rem]">
      <Metadata title={`Cute Collections`} />

      {/* Collections with scroll replay animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ amount: 0.2 }} //  replay on scroll up/down
        className="grid grid-cols-[repeat(auto-fit,15rem)] justify-center gap-4 mt-[3rem]"
      >
        {collections.map((collection, index) => (
          <div className="m-[1rem] cursor-pointer w-fit mx-auto">
            <motion.img
              className="rounded-full h-[8rem] w-[8rem] object-cover"
              key={collection.id}
              variants={itemVariants}
              custom={{
                direction: scrollDirection,
                depth: 30 + index * 6, // depth per image
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ amount: 0.2 }}
              src={collection.icon}
              alt={collection.title}
            />
            <h2 className="text-center text-snap-white font-semibold mt-[0.8rem]">
              {collection.title}
            </h2>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Collections;
