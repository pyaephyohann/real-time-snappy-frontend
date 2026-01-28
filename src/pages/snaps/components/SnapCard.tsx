import { useState } from "react";
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
import { motion, AnimatePresence, Variants } from "framer-motion";
import { config } from "../../../config";

interface UploadedBy {
  id: number;
  avatar_url: string;
  name: string;
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

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

const reactions: Reaction[] = [
  { label: "Like", emoji: "👍", reactionType: "like" },
  { label: "Love", emoji: "❤️", reactionType: "love" },
  { label: "Haha", emoji: "🤣", reactionType: "haha" },
  { label: "Wow", emoji: "😮", reactionType: "wow" },
  { label: "Sad", emoji: "😢", reactionType: "sad" },
  { label: "Angry", emoji: "😡", reactionType: "angry" },
];

const LikeOutlineIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
    />
  </svg>
);

const SnapCard = ({ id, url, caption, uploadedBy, react }: Props) => {
  const [reaction, setReaction] = useState<Reaction | null>(null);

  console.log(uploadedBy.avatar_url);

  const currentUserString = localStorage.getItem("currentUser");

  const currentUser: any | null = currentUserString
    ? JSON.parse(currentUserString)
    : null;

  const logInToken = localStorage.getItem("logInToken");

  const [showReactions, setShowReactions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [showMenuCard, setShowMenuCard] = useState(false);

  const [openComments, setOpenComments] = useState(false);

  const handleReactToggele = async (reaction: Reaction) => {
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
    if (response.ok) {
      return alert("Ogayyyy!");
    }
  };

  return (
    <div className="bg-snap-white p-4 w-fit rounded-md shadow relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <img
            alt={uploadedBy.name}
            src={uploadedBy.avatar_url}
            className="w-9 h-9 rounded-full object-cover"
          />
          <h2 className="text-sm font-semibold text-[0.8rem]">
            {uploadedBy.name}
          </h2>
        </div>

        {/* Menu Card */}
        {showMenuCard && (
          <div className="absolute top-[3rem] right-[1rem] gradient-background rounded-md p-[0.5rem]">
            {/* Edit Button */}
            <button className="flex items-center w-[5.5rem] py-[0.5rem] px-[0.2rem] gap-1 hover:bg-snap-black hover:bg-opacity-30 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#fff"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
              <span className="text-snap-white">Edit</span>
            </button>
            {/* Delete Button */}
            <button className="flex items-center py-[0.5rem] w-[5.5rem] px-[0.2rem] gap-1 hover:bg-snap-black hover:bg-opacity-30 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="#fff"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>

              <span className="text-snap-white">Delete</span>
            </button>
          </div>
        )}
        {/* Three Dot Menu */}
        {currentUser.role === "admin" && (
          <button onClick={() => setShowMenuCard(!showMenuCard)} className="">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Image */}
      <img
        className="w-[15rem] h-[15rem] object-cover rounded-md"
        src={url}
        alt={caption}
      />

      {/* Caption */}
      <p className="text-center mt-4 font-semibold text-sm gradient-color">
        {caption}
      </p>

      {/* Divider */}
      <div className="border-t mt-4" />

      {/* Action Bar */}
      <div className="flex justify-around items-center mt-2 text-sm text-gray-600 relative">
        {/* Like / Reaction */}
        <div
          className="relative"
          onMouseEnter={() => {
            setShowReactions(true);
            setShowShareOptions(false);
          }}
          onMouseLeave={() => setShowReactions(false)}
        >
          <button className="flex items-center gap-1 hover:text-primary">
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

          {/* Reaction Popup */}
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
                    onClick={() => handleReactToggele(rea)}
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
            />
          </svg>
          <span>Comment</span>
        </button>

        {/* Comment Drawer */}

        <CommentDrawer
          open={openComments}
          onClose={() => setOpenComments(false)}
        />

        {/* Share */}
        <button
          onClick={() => setShowShareOptions(!showShareOptions)}
          className="flex items-center gap-1 hover:text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
            />
          </svg>

          <span>Share</span>
          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                className="absolute bottom-[2.1rem] right-0 bg-white shadow-lg rounded-full px-3 py-2 flex gap-2 z-10"
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
        </button>
      </div>
    </div>
  );
};

export default SnapCard;
