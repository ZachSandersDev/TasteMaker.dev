import { ReactNode, createElement, useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";
import "emoji-picker-element";

import Button from "../../@design/components/Button/Button";
import { IconPickerDialog } from "../../@modules/stores/dialogs";
import { ImageField } from "../../@modules/types/imageField";
import classNames from "../../@modules/utils/classNames";

import ImageUpload from "../ImageUpload";

import "./IconPickerDialog.scss";

export interface IconPickerState {
  title: string;
  emojiOnly?: boolean;

  emojiValue?: string | null;
  imageValue?: ImageField | null;
  placeholder?: ReactNode;
}

export interface IconPickerResult {
  deleted?: true;
  newImage?: File;
  newEmoji?: string;
}

export function pickIcon(state: IconPickerState) {
  return new Promise<IconPickerResult | undefined>((resolve, reject) => {
    setRecoil(IconPickerDialog, { resolve, reject, payload: state });
  });
}

export default function IconPickerDialogComponent() {
  const [{ resolve, payload }, setDialogState] =
    useRecoilState(IconPickerDialog);

  const [tab, setTab] = useState<"image" | "emoji">("emoji");

  useEffect(() => {
    if (!payload) return;
    const { emojiOnly, imageValue } = payload;

    if (!emojiOnly && imageValue) setTab("image");
    setTab("emoji");
  }, [payload]);

  if (!payload) {
    return null;
  }

  const { title, emojiValue, imageValue, placeholder, emojiOnly } = payload;

  const onEmojiChange = (newEmoji: string) => {
    resolve?.({ newEmoji });
    setDialogState({});
  };

  const onImageChange = (newImage: File) => {
    resolve?.({ newImage });
    setDialogState({});
  };

  const onRemoveIcon = () => {
    resolve?.({ deleted: true });
    setDialogState({});
  };

  const close = () => {
    resolve?.();
    setDialogState({});
  };

  return (
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

          {tab === "emoji" && <EmojiPicker onEmojiClick={onEmojiChange} />}
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
          <Button onClick={onRemoveIcon} variant="naked">
            Remove Icon
          </Button>
          <Button variant="chip" onClick={close}>
            Save
          </Button>
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={close}></div>
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
