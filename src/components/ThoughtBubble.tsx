interface Props {
  text: string;
}

const ThoughtBubble = ({ text }: Props) => {
  return (
    <div className="relative inline-block ">
      {/* Main bubble */}
      <div className="relative bg-white text-gray-800 text-sm px-4 py-2 rounded-[2rem] shadow-lg">
        {text}

        {/* Medium dot */}
        <span className="absolute -bottom-4 left-6 w-3.5 h-3.5 bg-white rounded-full shadow-md" />

        {/* Small dot */}
        <span className="absolute -bottom-7 left-4 w-2 h-2 bg-white rounded-full shadow-md" />
      </div>
    </div>
  );
};

export default ThoughtBubble;
