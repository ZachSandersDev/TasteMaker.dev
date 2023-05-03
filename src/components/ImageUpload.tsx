import { ChangeEvent, useRef } from "react";
import { v4 as uuid } from "uuid";

import Button from "../@design/components/Button/Button";
import { ImageField } from "../@modules/types/recipes";
import classNames from "../@modules/utils/classNames";

import "./ImageUpload.scss";

export interface ImageUploadProps {
  editing: boolean;
  image?: ImageField | null;
  onChange?: (imgFile: File) => void;
  variant?: "banner" | "icon";
}

export default function ImageUpload({
  editing,
  image,
  onChange,
  variant = "banner",
}: ImageUploadProps) {
  const id = useRef(uuid());

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const imageFile = e.target.files[0];
    onChange?.(imageFile);
  };

  if (editing) {
    return (
      <>
        <label
          className={classNames(
            "ra-image-upload",
            image?.imageUrl && "image",
            variant
          )}
          htmlFor={`image-upload-${id.current}`}
          style={{
            backgroundImage: image?.imageUrl
              ? `url("${image?.imageUrl}")`
              : undefined,
          }}
        >
          <Button style={{ pointerEvents: "none" }} variant="icon">
            add_photo_alternate
          </Button>
        </label>
        <input
          className="ra-image-upload-file-input"
          type="file"
          id={`image-upload-${id.current}`}
          accept="image/*"
          onChange={handleFileChange}
        />
      </>
    );
  }

  if (!image?.imageUrl) {
    return null;
  }

  return <img className="ra-image-upload" src={image.imageUrl} />;
}
