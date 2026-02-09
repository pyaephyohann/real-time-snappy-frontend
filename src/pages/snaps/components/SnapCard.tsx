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
import FunDeleteMenu from "../../../components/FunDeleteMenu";

/* ===================== TYPES ===================== */

interface UploadedBy {
  id: number;
  url: string;
  name: string;
}

interface ServerReaction {
  id: number;
  user_id: number;
  reaction_type: string;
}

interface Reaction {
  label: string;
  emoji: string;
  reactionType: string;
}

interface Props {
  id: number;
  url: string;
  caption: string;
  uploadedBy: UploadedBy;
  reactions_count: number;
  reactions: ServerReaction[];
}

/* ===================== MOTION ===================== */

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
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

/* ===================== REACTIONS ===================== */

const reactionsList: Reaction[] = [
  { label: "Like", emoji: "👍", reactionType: "like" },
  { label: "Love", emoji: "❤️", reactionType: "love" },
  { label: "Haha", emoji: "🤣", reactionType: "haha" },
  { label: "Wow", emoji: "😮", reactionType: "wow" },
  { label: "Sad", emoji: "😢", reactionType: "sad" },
  { label: "Angry", emoji: "😡", reactionType: "angry" },
];

const reactionMap: Record<string, Reaction> = Object.fromEntries(
  reactionsList.map((r) => [r.reactionType, r]),
);

/* ===================== ICON ===================== */

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
      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904"
    />
  </svg>
);

/* ===================== COMPONENT ===================== */

const SnapCard = ({
  id,
  url,
  caption,
  uploadedBy,
  reactions_count,
  reactions,
}: Props) => {
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : null;

  const logInToken = localStorage.getItem("logInToken");

  const serverReaction = reactions.find((r) => r.user_id === currentUser?.id);

  const [reaction, setReaction] = useState<Reaction | null>(
    serverReaction ? reactionMap[serverReaction.reaction_type] : null,
  );

  const [reactionCount, setReactionCount] = useState(reactions_count);
  const [showReactions, setShowReactions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMenuCard, setShowMenuCard] = useState(false);
  const [openComments, setOpenComments] = useState(false);

  /* ===================== API HELPERS ===================== */

  const sendReaction = async (reactionType: string | null) => {
    const response = await fetch(
      `${config.apiBaseUrl}/images/${id}/reactions`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${logInToken}`,
        },
        body: JSON.stringify({
          image_id: id,
          reaction_type: reactionType, // null = remove
          user_id: currentUser.id,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    if (typeof data.reactions_count === "number") {
      setReactionCount(data.reactions_count);
    }
  };

  /* ===================== HANDLERS ===================== */

  // 👍 LIKE BUTTON TOGGLE
  const handleLikeToggle = async () => {
    if (!currentUser || !logInToken) {
      toast.error("Please sign in to react");
      return;
    }

    try {
      if (reaction) {
        // REMOVE reaction
        setReaction(null);
        setReactionCount((prev) => Math.max(prev - 1, 0));
        await sendReaction(null);
      } else {
        // ADD like
        setReaction(reactionMap.like);
        setReactionCount((prev) => prev + 1);
        await sendReaction("like");
      }
    } catch (err: any) {
      toast.error(err.message || "Reaction failed");
    }
  };

  //  EMOJI REACTION
  const handleEmojiReact = async (newReaction: Reaction) => {
    if (!currentUser || !logInToken) {
      toast.error("Please sign in to react");
      return;
    }

    if (!reaction) {
      setReactionCount((prev) => prev + 1);
    }

    setReaction(newReaction);
    setShowReactions(false);

    try {
      await sendReaction(newReaction.reactionType);
    } catch (err: any) {
      toast.error(err.message || "Reaction failed");
    }
  };

  /* ===================== JSX ===================== */

  return (
    <div className="bg-white p-4 w-full max-w-sm rounded-lg shadow-md relative mx-auto mb-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <img
            src={uploadedBy.url}
            alt={uploadedBy.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-sm font-semibold">{uploadedBy.name}</span>
        </div>

        <div className="relative">
          <button onClick={() => setShowMenuCard(!showMenuCard)}>⋮</button>
          {showMenuCard && <FunDeleteMenu showMenuCard />}
        </div>
      </div>

      {/* Image */}
      <img
        src={url}
        alt={caption}
        className="w-full h-60 object-cover rounded-md"
      />

      {/* Caption */}
      {caption && (
        <p className="text-center mt-2 font-medium text-sm">{caption}</p>
      )}

      <div className="border-t mt-3" />

      {/* Actions */}
      <div className="flex justify-around mt-2 text-sm relative">
        {/* Reaction */}
        <div
          className="relative"
          onMouseEnter={() => setShowReactions(true)}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button
            onClick={handleLikeToggle}
            className="flex items-center gap-1"
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
            {reactionCount > 0 && (
              <span className="text-xs text-gray-500 ml-1">
                {reactionCount}
              </span>
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
                {reactionsList.map((r) => (
                  <motion.button
                    key={r.reactionType}
                    variants={itemVariants}
                    whileHover={{ scale: 1.3 }}
                    onClick={() => handleEmojiReact(r)}
                    className="text-xl"
                  >
                    {r.emoji}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Comment */}
        <button onClick={() => setOpenComments(true)}>Comment</button>
        <CommentDrawer
          open={openComments}
          onClose={() => setOpenComments(false)}
        />

        {/* Share */}
        <div className="relative">
          <button onClick={() => setShowShareOptions(!showShareOptions)}>
            Share
          </button>

          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                className="absolute bottom-8 right-0 bg-white shadow-lg rounded-full px-3 py-2 flex gap-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <FacebookShareButton url={url}>
                  <FacebookIcon size={28} round />
                </FacebookShareButton>
                <ViberShareButton url={url}>
                  <ViberIcon size={28} round />
                </ViberShareButton>
                <TelegramShareButton url={url}>
                  <TelegramIcon size={28} round />
                </TelegramShareButton>
                <ThreadsShareButton url={url}>
                  <ThreadsIcon size={28} round />
                </ThreadsShareButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SnapCard;
