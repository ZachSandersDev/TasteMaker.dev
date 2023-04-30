import { createElement, useEffect, useRef, useState } from "react";
import "emoji-picker-element";

import Button from "../../@design/components/Button";
export interface EmojiPickerDialogProps {
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onEmojiChange: (emoji: string) => void;
}

export default function EmojiPickerDialog({
  value,
  placeholder,
  onEmojiChange,
  disabled,
}: EmojiPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const setIcon = (emoji: string) => {
    setIsOpen(false);
    onEmojiChange(emoji);
  };

  return (
    <>
      <Button
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
          }
        }}
        disabled={disabled}
        variant="naked"
        size="lg"
      >
        {value || <i className="material-symbols-rounded">{placeholder}</i>}
      </Button>

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
