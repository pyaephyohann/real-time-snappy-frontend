import { useState, useRef } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

export type ReactionCounts = Record<string, number>;

interface ReactionPickerProps {
  value: string | null;
  counts?: ReactionCounts;
  onChange: (emoji: string | null) => void;
}

export default function ReactionPicker({
  value,
  counts = {},
  onChange,
}: ReactionPickerProps) {
  const [open, setOpen] = useState<boolean>(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = (): void => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setOpen(true);
  };

  const hide = (): void => {
    hideTimeout.current = setTimeout(() => setOpen(false), 150);
  };

  const handleSelect = (emoji: string): void => {
    onChange(emoji === value ? null : emoji);
    setOpen(false);
  };

  return (
    <div
      className="relative inline-flex items-center gap-2"
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={() => setOpen((o) => !o)}
    >
      {/* ICON / SELECTED REACTION */}
      <button type="button" className="text-xl cursor-pointer select-none">
        {value ?? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        )}
      </button>

      {/* COUNTS */}
      {Object.keys(counts).length > 0 && (
        <div className="flex gap-1 text-sm">
          {Object.entries(counts).map(([emoji, count]) => (
            <span key={emoji}>
              {emoji} {count}
            </span>
          ))}
        </div>
      )}

      {/* PICKER */}
      {open && (
        <div
          className="absolute bottom-full left-0 mb-2 z-50"
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <EmojiPicker
            height={300}
            width={280}
            onEmojiClick={(emojiData: EmojiClickData) =>
              handleSelect(emojiData.emoji)
            }
          />
        </div>
      )}
    </div>
  );
}
