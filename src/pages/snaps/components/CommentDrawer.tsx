import CancelButton from "../../../components/CancelButton";

interface CommentDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CommentDrawer = ({ open, onClose }: CommentDrawerProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl
        h-[60%] animate-slideUp flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <span></span>
          <h3 className="font-semibold text-[1.5rem] gradient-color">
            Comments
          </h3>
          <CancelButton callBack={() => onClose()} />
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="flex gap-2">
            <img
              alt="user"
              className="w-8 h-8 rounded-full"
              src="https://i.pinimg.com/736x/62/6b/91/626b91460049992c732ae71917de14ed.jpg"
            />
            <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm">
              Nice post 🔥
            </div>
          </div>

          <div className="flex gap-2">
            <img
              alt="user"
              className="w-8 h-8 rounded-full"
              src="https://i.pinimg.com/736x/62/6b/91/626b91460049992c732ae71917de14ed.jpg"
            />
            <div className="bg-gray-100 rounded-xl px-3 py-2 text-sm">
              Looks just like Facebook 😄
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            onChange={() => {}}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Write a comment ..."
          />
          {/* Send Button */}
          <button className="mx-[0.5rem] font-semibold">
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
                d="
      M3.269 3.125a.75.75 0 0 1 .948.5L6.75 11.25H14.25
      a.75.75 0 0 1 0 1.5H6.75l-2.533 7.625
      a.75.75 0 0 1-.948.5
      59.77 59.77 0 0 0 18.216-8.875
      59.77 59.77 0 0 0-18.216-8.875Z
    "
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentDrawer;
