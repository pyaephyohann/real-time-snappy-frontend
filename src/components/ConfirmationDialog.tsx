import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  bodyText: string;
  callBack: () => void;
}

const modalRoot = document.getElementById("modal-root");

const ConfirmationDialog = ({
  open,
  setOpen,
  title,
  bodyText,
  callBack,
}: Props) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setOpen]);

  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-[1000] flex items-center justify-center px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[1.5rem] font-semibold gradient-color text-center">
                {title}
              </h2>

              <div className="mt-[2rem] space-y-[1rem] text-sm text-gray-600">
                <p className="text-[1.2rem]">{bodyText}</p>
                <p className="text-red-500 font-medium mt-[2rem]">
                  This action cannot be undone!
                </p>
              </div>

              <div className="mt-6 flex justify-between gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    callBack();
                    setOpen(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    modalRoot
  );
};

export default ConfirmationDialog;
