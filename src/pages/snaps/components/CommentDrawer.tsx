import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CancelButton from "../../../components/CancelButton";
import { config } from "../../../config";
import { logInToken } from "../../../utils";
import CommentItem from "../../../components/CommentItem";

interface User {
  id: number;
  name: string;
  avatar_url: string;
}

interface Comment {
  id: number;
  comment: string;
  created_at: string;
  user?: User;
  replies: any;
}

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  imageId: number;
}

const CommentDrawer = ({
  open,
  onClose,
  imageId,
  comments,
}: CommentDrawerProps) => {
  const [commentsList, setCommentsList] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const currentUserString = localStorage.getItem("currentUser");

  const currentUser: any | null = currentUserString
    ? JSON.parse(currentUserString)
    : null;

  // 🔹 Sync comments from parent
  useEffect(() => {
    setCommentsList(comments);
  }, [comments]);

  // 🔹 Create comment
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${config.apiBaseUrl}/images/${imageId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${logInToken}`,
          },
          body: JSON.stringify({
            comment: text,
            parent_id: null,
            user_id: currentUser.id,
          }),
        },
      );

      const data = await res.json();

      const newComment: Comment = {
        ...data.datas,
        user: currentUser,
      };

      setCommentsList((prev) => [...prev, newComment]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          {/* Drawer */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl h-[60%] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <span />
              <h3 className="font-semibold text-[1.5rem] gradient-color">
                Comments
              </h3>
              <CancelButton callBack={onClose} />
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {commentsList.map((c) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm max-w-[80%]">
                    <CommentItem
                      key={c.id}
                      commentId={c.id}
                      comment={c.comment}
                      user={c.user}
                      replies={c.replies}
                      imageId={imageId}
                      // reactions={c.reactions}
                      // reactions_count={c.reactions_count}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form className="p-4 border-t flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Write a comment..."
              />
              <button
                type="submit"
                onClick={handleSend}
                disabled={loading}
                className="font-semibold disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="size-8 -rotate-45"
                >
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="35%" stopColor="#ff69b4" />
                      <stop offset="100%" stopColor="#ffa07a" />
                    </linearGradient>
                  </defs>

                  <path
                    fill="url(#grad)"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.269 3.125a.75.75 0 0 1 .948.5L6.75 11.25H14.25a.75.75 0 0 1 0 1.5H6.75l-2.533 7.625a.75.75 0 0 1-.948.5 59.77 59.77 0 0 0 18.216-8.875 59.77 59.77 0 0 0-18.216-8.875Z"
                  />
                </svg>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommentDrawer;
