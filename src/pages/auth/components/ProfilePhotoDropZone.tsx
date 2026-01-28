import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onSelectFile: (value: File[]) => void;
}

const ProfilePhotoDropZone = ({ onSelectFile }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onSelectFile(acceptedFiles);
    },
    [onSelectFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="cursor-pointer" {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-20"
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
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="size-20"
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
            d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            clipRule="evenodd"
          />
        </svg>
      )}
    </div>
  );
};

export default ProfilePhotoDropZone;
