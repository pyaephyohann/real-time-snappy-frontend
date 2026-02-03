import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../components/Button";
import CancelButton from "../../../components/CancelButton";
import Loading from "../../../components/Loading";
import NewImageDropZone from "./NewImageDropZone";
import { config } from "../../../config";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  title: string;
  callBack: () => void;
  getAllImagesByUserId: () => void;
}

interface ImageUploadDatas {
  url: string;
  caption: string;
  user_id: number;
  category_id: number;
}

const modalRoot = document.getElementById("modal-root");

const NewImage = ({
  open,
  setOpen,
  title,
  callBack,
  getAllImagesByUserId,
}: Props) => {
  const { userId } = useParams();
  const logInToken = localStorage.getItem("logInToken");

  const [newImageDatas, setNewImageDatas] = useState<ImageUploadDatas>({
    url: "",
    caption: "",
    user_id: Number(userId),
    category_id: 1,
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
  const [tempPath, setTempPath] = useState<string>("");
  const [isUploadingToTemp, setIsUploadingToTemp] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const isDisabled =
    !selectedFiles.length ||
    !newImageDatas.caption ||
    !newImageDatas.user_id ||
    !newImageDatas.category_id ||
    !tempPath ||
    isUploading;

  /** Upload the image to final destination */
  const handleImageUpload = async () => {
    if (!logInToken) {
      toast.error("You must be logged in to upload images");
      return;
    }

    setIsUploading(true);

    try {
      const response = await fetch(
        `${config.apiBaseUrl}/users/${userId}/finalize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${logInToken}`,
          },
          body: JSON.stringify({
            temp_path: tempPath,
            caption: newImageDatas.caption,
            category_id: 1,
          }),
        },
      );

      const responseJson = await response.json();

      if (!response.ok) {
        throw new Error(responseJson?.message || "Failed to upload image");
      }

      // Set final image URL
      setNewImageDatas((prev) => ({ ...prev, url: responseJson.url }));

      toast.success("New Snap Uploaded!");
      getAllImagesByUserId();

      // Reset state
      setSelectedFiles([]);
      setSelectedImageUrl("");
      setTempPath("");
      setNewImageDatas({
        url: "",
        caption: "",
        user_id: Number(userId),
        category_id: 1,
      });
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
    }
  };

  /** Select and upload a file to temp storage */
  const handleSelectFile = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;

    setIsUploadingToTemp(true);

    const file = acceptedFiles[0];

    // Rename file
    const randomPart = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split(".").pop();
    const renamedFile = new File([file], `snappy_${randomPart}.${extension}`, {
      type: file.type,
    });

    setSelectedFiles([renamedFile]);
    setSelectedImageUrl(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("image", renamedFile);

    try {
      const response = await fetch(`${config.apiBaseUrl}/images/upload-temp`, {
        method: "POST",
        headers: { Authorization: `Bearer ${logInToken}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to upload image to temp storage",
        );
      }

      setTempPath(data.temp_path);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
      setSelectedFiles([]);
      setSelectedImageUrl("");
      setTempPath("");
    } finally {
      setIsUploadingToTemp(false);
    }
  };

  /** Close modal on ESC */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) =>
      e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setOpen]);

  if (!modalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Modal content */}
          <div
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* close button*/}
            <div className="absolute top-0 right-0 z-20">
              <CancelButton
                disabled={isUploading || isUploadingToTemp}
                callBack={() => setOpen(false)}
              />
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold gradient-color text-center mb-6">
              {title}
            </h2>

            {/* Image preview or dropzone */}
            {selectedImageUrl ? (
              <div className="relative w-full max-w-xs mx-auto">
                {isUploadingToTemp && (
                  <div className="absolute inset-0 z-10 bg-black/30 flex justify-center items-center rounded-md">
                    <Loading size={20} />
                  </div>
                )}
                <img
                  src={selectedImageUrl}
                  alt="Preview"
                  className="w-full h-64 sm:h-72 object-cover rounded-md"
                />
              </div>
            ) : (
              <NewImageDropZone onSelectFile={handleSelectFile} />
            )}

            {/* Caption */}
            <div className="my-6">
              <label className="block text-sm font-medium mb-2">Caption</label>
              <input
                type="text"
                name="caption"
                disabled={isUploading}
                value={newImageDatas.caption}
                onChange={(e) =>
                  setNewImageDatas((prev) => ({
                    ...prev,
                    caption: e.target.value,
                  }))
                }
                placeholder="Enter a caption..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Upload button */}
            <div className="mt-4 w-full flex justify-center">
              <Button
                callBack={handleImageUpload}
                title="Post Image"
                isDisabled={isDisabled}
                isLoading={isUploading}
                buttonClassName="w-full sm:w-64"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    modalRoot,
  );
};

export default NewImage;
