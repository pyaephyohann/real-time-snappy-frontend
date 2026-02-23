import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { config } from "../config";
import { logInToken } from "../utils";

/* ================= TYPES ================= */

interface User {
  id: number;
  name: string;
  avatar_url?: string;
}

interface Reply {
  id: number;
  comment: string;
  user: any;
}

interface Props {
  commentId: number;
  imageId: number;
  comment: string;
  user: any;
  replies?: Reply[];
}

/* ================= COMPONENT ================= */

export default function CommentItem({
  commentId,
  imageId,
  comment,
  user,
  replies = [],
}: Props) {
  const currentUser = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser")!)
    : {
        name: "You",
        avatar_url: "https://ui-avatars.com/api/?name=You",
      };

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState<Reply[]>(replies);
  const [showReplies, setShowReplies] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= SEND REPLY ================= */

  const handleReplySubmit = async () => {
    if (!replyText.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${config.apiBaseUrl}/images/${imageId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${logInToken}`,
          },
          body: JSON.stringify({
            comment: replyText,
            parent_id: commentId,
            user_id: currentUser.id,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      const newReply: Reply = data.datas;

      setLocalReplies((prev) => [...prev, newReply]);
      setReplyText("");
      setShowReplyInput(false);
      setShowReplies(true);
    } catch (error) {
      console.error("Reply failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* MAIN COMMENT */}
      <div className="flex gap-3">
        <img
          src={user?.avatar_url ?? "https://ui-avatars.com/api/?name=User"}
          className="w-10 h-10 rounded-full object-cover"
          alt="avatar"
        />

        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl p-3 text-sm inline-block">
            <p className="font-semibold mb-1">{user?.name}</p>
            {comment}
          </div>

          <div className="flex gap-4 text-xs text-gray-500 mt-1 ml-2">
            <button
              onClick={() => setShowReplyInput((prev) => !prev)}
              className="hover:underline"
            >
              Reply
            </button>

            {localReplies.length > 0 && (
              <button
                onClick={() => setShowReplies((prev) => !prev)}
                className="hover:underline font-medium"
              >
                {showReplies
                  ? "Hide replies"
                  : `View ${localReplies.length} ${
                      localReplies.length === 1 ? "reply" : "replies"
                    }`}
              </button>
            )}

            <span>2h</span>
          </div>
        </div>
      </div>

      {/* REPLIES */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="ml-12 flex flex-col gap-3 overflow-hidden"
          >
            {localReplies.map((reply) => (
              <div key={reply.id} className="flex gap-3">
                <img
                  src={
                    reply.user?.avatar_url ??
                    "https://ui-avatars.com/api/?name=User"
                  }
                  className="w-8 h-8 rounded-full object-cover"
                  alt="reply-avatar"
                />

                <div className="bg-gray-100 rounded-2xl p-2 text-sm inline-block">
                  <p className="font-semibold mb-1">{reply.user?.name}</p>
                  {reply.comment}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* REPLY INPUT */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-2 mt-2 ml-12"
          >
            <img
              src={
                currentUser.avatar_url ?? "https://ui-avatars.com/api/?name=You"
              }
              className="w-8 h-8 rounded-full object-cover"
              alt="current-user"
            />

            <form className="flex-1 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                onClick={handleReplySubmit}
                className="text-primary font-semibold text-sm"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
