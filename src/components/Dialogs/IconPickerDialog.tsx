import { ReactNode, createElement, useEffect, useRef, useState } from "react";
import "emoji-picker-element";

import Button from "../../@design/components/Button/Button";
import { ImageField } from "../../@modules/types/recipes";
import classNames from "../../@modules/utils/classNames";

import ImageUpload from "../ImageUpload";

import "./IconPickerDialog.scss";

export interface IconPickerDialogProps {
  title: string;

  emojiOnly?: boolean;

  emojiValue?: string;
  imageValue?: ImageField | null;
  placeholder: ReactNode;

  disabled?: boolean;
  onEmojiChange?: (emoji: string) => void;
  onImageChange?: (imageFile: File) => void;
}

export default function IconPickerDialog({
  title,
  emojiValue,
  imageValue,
  placeholder,
  emojiOnly = false,
  onEmojiChange,
  onImageChange,
  disabled,
}: IconPickerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"image" | "emoji">(
    emojiOnly ? "emoji" : imageValue ? "image" : "emoji"
  );

  const setIcon = (emoji: string) => {
    setIsOpen(false);
    onEmojiChange?.(emoji);
  };

  return (
    <>
      <Button
        className="icon-picker-button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
          }
        }}
        disabled={disabled}
        variant="naked"
        size="lg"
      >
        {imageValue ? (
          <img src={imageValue.imageUrl} />
        ) : (
          emojiValue || placeholder
        )}
      </Button>

      {isOpen && (
        <>
          <div className="ra-dialog ra-card icon-picker">
            <div className="ra-card-header">
              <h3>{title}</h3>
              <Button disabled={true} variant="naked" size="lg">
                {imageValue ? (
                  <img src={imageValue.imageUrl} />
                ) : (
                  emojiValue || placeholder
                )}
              </Button>
            </div>

            <div className="icon-picker-contents">
              {tab === "image" && onImageChange && (
                <ImageUpload
                  editing={true}
                  image={imageValue}
                  onChange={onImageChange}
                  variant="icon"
                />
              )}

              {tab === "emoji" && <EmojiPicker onEmojiClick={setIcon} />}
            </div>

            <div className="ra-actions">
              {!emojiOnly && (
                <div className="ra-actions center-actions">
                  <Button
                    className={classNames(tab === "emoji" && "active")}
                    variant="icon"
                    onClick={() => setTab("emoji")}
                  >
                    mood
                  </Button>
                  <Button
                    className={classNames(tab === "image" && "active")}
                    variant="icon"
                    onClick={() => setTab("image")}
                  >
                    image
                  </Button>
                </div>
              )}
              <Button onClick={() => setIsOpen(false)}>Save</Button>
            </div>
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

  return createElement("emoji-picker", { ref, class: "emoji-picker" });
}
