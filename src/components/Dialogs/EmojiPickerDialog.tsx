import { createElement, useEffect, useRef, useState } from "react";

import "emoji-picker-element";

export interface EmojiPickerDialogProps {
  value: string;
  onEmojiChange: (emoji: string) => void;
}

export default function EmojiPickerDialog({
  value,
  onEmojiChange,
}: EmojiPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const setIcon = (emoji: string) => {
    setIsOpen(false);
    onEmojiChange(emoji);
  };

  return (
    <>
      <button className="icon-button" style={{fontSize: "1.5em", marginBottom: "calc(var(--spacing) * 2)"}} onClick={() => setIsOpen(true)}>
        {value}
      </button>

      {isOpen && (
        <>
          <div className="ra-dialog">
            <EmojiPicker onEmojiClick={setIcon} />
          </div>
          <div
            className="ra-dialog-cover"
            onClick={() => setIsOpen(false)}
          ></div>
        </>
      )}
    </>
  );
}

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

function EmojiPicker({ onEmojiClick }: EmojiPickerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const listener: any = (event: {
      detail: { emoji: { unicode: string } };
    }) => {
      onEmojiClick(event.detail.emoji.unicode);
    };

    ref.current?.addEventListener("emoji-click", listener);
    return () => ref.current?.removeEventListener("emoji-click", listener);
  }, []);

  return createElement("emoji-picker", { ref });
}
