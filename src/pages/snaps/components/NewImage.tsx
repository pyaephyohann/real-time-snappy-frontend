import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NewImageDropZone from "./NewImageDropZone";
import { useParams } from "react-router-dom";
import { config } from "../../../config";
import Button from "../../../components/Button";
import CancelButton from "../../../components/CancelButton";
import { toast } from "react-toastify";
import Loading from "../../../components/Loading";

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

  const [isUploadingToTemp, setIsUploadingToTemp] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [tempPath, setTempPath] = useState<string>("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");

  const isDisabled =
    !selectedFiles.length ||
    !newImageDatas.caption ||
    !newImageDatas.user_id ||
    !newImageDatas.category_id ||
    !tempPath ||
    isUploading;

  const handleImageUpload = async () => {
    // file upload

    setIsUploading(true);

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
    if (!response.ok) return alert("Something wrong while uploading image!");
    const assetUrl = responseJson.url;
    newImageDatas.url = assetUrl;

    if (response.ok) {
      const notify = () => toast(`New Snap Uploaded!`);
      notify();
      getAllImagesByUserId();
      setNewImageDatas({
        url: "",
        caption: "",
        user_id: Number(userId),
        category_id: 1,
      });
      setTempPath("");
      setSelectedFiles([]);
      setSelectedImageUrl("");
      setOpen(false);
    }
    setIsUploading(false);
  };

  const handleSelectFile = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setIsUploadingToTemp(true);

    const originalFile = acceptedFiles[0];

    const randomPart = Math.random().toString().split(".")[1];
    const newFileName = `snappy_${randomPart}.${originalFile.name
      .split(".")
      .pop()}`;

    const renamedFile = new File([originalFile], newFileName, {
      type: originalFile.type,
    });

    setSelectedFiles([renamedFile]);

    const formData = new FormData();
    formData.append("image", renamedFile);

    const firstImageUrl = URL.createObjectURL(acceptedFiles[0]);
    setSelectedImageUrl(firstImageUrl);
    // upload to temp folder

    const response = await fetch(`${config.apiBaseUrl}/images/upload-temp`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${logInToken}`,
      },
      body: formData,
    });

    const responseJson = await response.json();

    if (response.ok) {
      setTempPath(responseJson.temp_path);
    } else {
      alert("Something wrong while uploading image!");
    }
    setIsUploadingToTemp(false);
  };

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
            className="fixed inset-0 z-[1000] flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div
              className="w-full max-w-[35rem] bg-white rounded-2xl shadow-xl p-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* cancel creating new image */}
              <div className="absolute -top-3 -right-3">
                <CancelButton
                  disabled={isUploading || isUploadingToTemp}
                  callBack={() => setOpen(false)}
                />
              </div>
              <h2 className="text-[1.5rem] mb-[2rem] font-semibold gradient-color text-center">
                {title}
              </h2>
              {selectedImageUrl ? (
                <div className="mx-auto relative w-fit">
                  {isUploadingToTemp && (
                    <div className="absolute w-full top-0 left-0 right-0 bottom-0 z-10 bg-snap-black opacity-30 flex justify-center items-center rounded-md">
                      <Loading size={15} />
                    </div>
                  )}
                  <div className="absolute -top-3 -right-3 z-20">
                    <CancelButton
                      disabled={isUploading || isUploadingToTemp}
                      callBack={() => {
                        setSelectedImageUrl("");
                        setSelectedFiles([]);
                      }}
                    />
                  </div>
                  <img
                    src={selectedImageUrl}
                    alt="Preview"
                    className="w-[10rem] h-[10rem] object-cover rounded-md"
                  />
                </div>
              ) : (
                <NewImageDropZone onSelectFile={handleSelectFile} />
              )}
              {/* Caption */}
              <div className="my-[2rem]">
                <label className="block text-sm font-medium mb-[0.5rem]">
                  Caption
                </label>
                <input
                  disabled={isUploading}
                  type="text"
                  name="caption"
                  onChange={(e) => {
                    setNewImageDatas((prev) => ({
                      ...prev,
                      caption: e.target.value,
                    }));
                  }}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter a caption ..."
                />
              </div>
              {/* User Drop Down
              <div>
                <label className="block text-sm font-medium mb-[0.5rem]">
                  Caption
                </label>
                <UsersDropDown
                  options={usersDropDownList}
                  onSelect={(id) => {
                    setNewImageDatas({ ...newImageDatas, user_id: id });
                  }}
                />
              </div> */}
              <div className="mt-[2rem] w-fit mx-auto">
                <Button
                  callBack={handleImageUpload}
                  isDisabled={isDisabled}
                  title="Post Image"
                  isLoading={isUploading ? true : false}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    modalRoot,
  );
};

export default NewImage;
