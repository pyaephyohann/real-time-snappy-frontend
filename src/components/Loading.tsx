import { CSSProperties } from "react";
import { BeatLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

interface Props {
  size: number;
}

const Loading = ({ size }: Props) => {
  return (
    <div className="sweet-loading">
      <BeatLoader
        color={"#ffffff"}
        cssOverride={override}
        size={size}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loading;
