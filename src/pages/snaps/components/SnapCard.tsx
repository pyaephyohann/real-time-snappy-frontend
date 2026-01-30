import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { toast } from "react-toastify";
import CommentDrawer from "./CommentDrawer";
import {
  FacebookShareButton,
  FacebookIcon,
  ViberShareButton,
  ViberIcon,
  TelegramShareButton,
  TelegramIcon,
  ThreadsShareButton,
  ThreadsIcon,
} from "react-share";
import { config } from "../../../config";

interface UploadedBy {
  id: number;
  url: string;
  name: string;
  role?: string;
}

interface Props {
  id: number;
  url: string;
  caption: string;
  uploadedBy: UploadedBy;
  react?: string;
}

interface Reaction {
  label: string;
  emoji: string;
  reactionType: string;
}

// Framer motion variants
const containerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
  exit: { opacity: 0, y: 10 },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 20 },
  },
};

// Reaction options
const reactions: Reaction[] = [
  { label: "Like", emoji: "👍", reactionType: "like" },
  { label: "Love", emoji: "❤️", reactionType: "love" },
  { label: "Haha", emoji: "🤣", reactionType: "haha" },
  { label: "Wow", emoji: "😮", reactionType: "wow" },
  { label: "Sad", emoji: "😢", reactionType: "sad" },
  { label: "Angry", emoji: "😡", reactionType: "angry" },
];

// Like Icon
const LikeOutlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
    />
  </svg>
);

const SnapCard = ({ id, url, caption, uploadedBy }: Props) => {
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [showReactions, setShowReactions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMenuCard, setShowMenuCard] = useState(false);
  const [openComments, setOpenComments] = useState(false);

  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  const logInToken = localStorage.getItem("logInToken");

  // Reaction handler
  const handleReactToggle = async (reaction: Reaction) => {
    if (!currentUser || !logInToken) {
      toast.error("Please sign in to react");
      return;
    }
    try {
      setReaction(reaction);
      setShowReactions(false);

      const response = await fetch(`${config.apiBaseUrl}/reactions/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logInToken}`,
        },
        body: JSON.stringify({
          image_id: id,
          reaction_type: reaction.reactionType,
          user_id: currentUser.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to react");

      toast.success(`You reacted with ${reaction.label} ${reaction.emoji}`);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="bg-snap-white p-4 w-full max-w-xs sm:max-w-sm rounded-lg shadow-md relative mx-auto mb-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img
            src={uploadedBy.url}
            alt={uploadedBy.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <h2 className="text-sm font-semibold truncate">{uploadedBy.name}</h2>
        </div>

        {currentUser?.role === "admin" && (
          <div className="relative">
            <button
              onClick={() => setShowMenuCard(!showMenuCard)}
              className="p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </button>

            {showMenuCard && (
              <div className="absolute top-8 right-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md p-2 flex flex-col gap-2 z-20">
                <button className="flex items-center gap-2 text-white hover:bg-black hover:bg-opacity-20 rounded-md p-1">
                  Edit
                </button>
                <button className="flex items-center gap-2 text-white hover:bg-black hover:bg-opacity-20 rounded-md p-1">
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image */}
      <img
        src={url}
        alt={caption}
        className="w-full h-60 sm:h-64 object-cover rounded-md"
      />

      {/* Caption */}
      {caption && (
        <p className="text-center mt-2 font-medium text-sm text-gray-800">
          {caption}
        </p>
      )}

      {/* Divider */}
      <div className="border-t mt-3" />

      {/* Action Bar */}
      <div className="flex justify-around items-center mt-2 text-sm relative">
        {/* Like / Reaction */}
        <div
          className="relative"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            disabled={!currentUser}
            className={`flex items-center gap-1 ${!currentUser ? "opacity-50 cursor-not-allowed" : "hover:text-primary"}`}
          >
            {reaction ? (
              <>
                <span className="text-lg">{reaction.emoji}</span>
                <span>{reaction.label}</span>
              </>
            ) : (
              <>
                <LikeOutlineIcon />
                <span>Like</span>
              </>
            )}
          </button>

          <AnimatePresence>
            {showReactions && (
              <motion.div
                className="absolute -top-12 left-0 bg-white shadow-lg rounded-full px-3 py-2 flex gap-2 z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {reactions.map((rea) => (
                  <motion.button
                    key={rea.label}
                    variants={itemVariants}
                    className="text-xl"
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 1.5 }}
                    onClick={() => handleReactToggle(rea)}
                  >
                    {rea.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment */}
        <button
          onClick={() => setOpenComments(true)}
          className="flex items-center gap-1 hover:text-primary"
        >
          <span>💬 Comment</span>
        </button>

        <CommentDrawer
          open={openComments}
          onClose={() => setOpenComments(false)}
        />

        {/* Share */}
        <div className="relative">
          <button
            onClick={() => setShowShareOptions(!showShareOptions)}
            className="flex items-center gap-1 hover:text-primary"
          >
            <span>🔗 Share</span>
          </button>

          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                className="absolute bottom-8 right-0 bg-white shadow-lg rounded-full px-3 py-2 flex gap-2 z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div variants={itemVariants}>
                  <FacebookShareButton url={url}>
                    <FacebookIcon size={28} round />
                  </FacebookShareButton>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ViberShareButton url={url}>
                    <ViberIcon size={28} round />
                  </ViberShareButton>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <TelegramShareButton url={url}>
                    <TelegramIcon size={28} round />
                  </TelegramShareButton>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <ThreadsShareButton url={url}>
                    <ThreadsIcon size={28} round />
                  </ThreadsShareButton>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SnapCard;
