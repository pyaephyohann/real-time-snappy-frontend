import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  onSelectFile: (value: File[]) => void;
}

const NewImageDropZone = ({ onSelectFile }: Props) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onSelectFile(acceptedFiles);
    },
    [onSelectFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="border border-dashed rounded-lg p-[1rem] border-snap-black">
          Drop the files here ...
        </p>
      ) : (
        <p className="border border-dashed rounded-lg p-[1rem] border-snap-black">
          Drag 'n' drop some files here, or click to select files
        </p>
      )}
    </div>
  );
};

export default NewImageDropZone;
