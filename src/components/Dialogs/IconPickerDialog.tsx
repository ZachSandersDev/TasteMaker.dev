import { ReactNode, createElement, useEffect, useRef, useState } from "react";
import "emoji-picker-element";

import Button from "../../@design/components/Button/Button";
import { ImageField } from "../../@modules/types/imageField";
import classNames from "../../@modules/utils/classNames";

import ImageUpload from "../ImageUpload";

import "./IconPickerDialog.scss";

export interface IconPickerDialogProps {
  title: string;

  emojiOnly?: boolean;

  emojiValue?: string | null;
  imageValue?: ImageField | null;
  placeholder?: ReactNode;

  disabled?: boolean;
  onEmojiChange?: (emoji: string) => void;
  onImageChange?: (imageFile: File) => void;
  onRemoveIcon?: () => void;
}

export default function IconPickerDialog({
  title,
  emojiValue,
  imageValue,
  placeholder,
  emojiOnly = false,
  onEmojiChange,
  onImageChange,
  onRemoveIcon,
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
      <div className="icon-header">
        {!imageValue && !emojiValue && !placeholder && !disabled && (
          <Button
            className="icon-hidden-option"
            variant="chip"
            iconBefore="add"
            size="sm"
            onClick={() => {
              setIsOpen(true);
            }}
          >
            add icon
          </Button>
        )}

        {(imageValue || emojiValue || placeholder) && (
          <Button
            className="icon-picker-button"
            onClick={() => {
              if (!disabled) {
                setIsOpen(true);
              }
            }}
            disabled={disabled}
            variant="icon"
            size="lg"
            noPadding
          >
            {imageValue ? (
              <img src={imageValue.imageUrl} />
            ) : (
              emojiValue || placeholder
            )}
          </Button>
        )}
      </div>

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
                    iconBefore="mood"
                  />
                  <Button
                    className={classNames(tab === "image" && "active")}
                    variant="icon"
                    onClick={() => setTab("image")}
                    iconBefore="image"
                  />
                </div>
              )}
              <Button
                onClick={() => {
                  onRemoveIcon?.();
                  setIsOpen(false);
                }}
                variant="naked"
              >
                Remove Icon
              </Button>
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
