import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useState } from "react";

import "./EmojiPickerDialog.scss";

export interface EmojiPickerDialogProps {
  value: string;
  onEmojiChange: (emoji: string) => void;
}

export default function EmojiPickerDialog({
  value,
  onEmojiChange,
}: EmojiPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const setIcon = (e: EmojiClickData) => {
    setIsOpen(false);
    onEmojiChange(e.emoji);
  };

  return (
    <>
      <button className="icon-button" onClick={() => setIsOpen(true)}>
        {value}
      </button>

      {isOpen && (
        <>
          <div className="ra-dialog">
            <EmojiPicker
              autoFocusSearch
              theme={Theme.AUTO}
              onEmojiClick={setIcon}
              previewConfig={{ showPreview: false }}
              lazyLoadEmojis
            />
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
