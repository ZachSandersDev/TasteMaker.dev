import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import classNames from "../@modules/utils/classNames";
import { quickHash } from "../@modules/utils/quickHash";

import "./ProfileImage.scss";

export interface ProfileImageProps {
  onChange?: (image: File) => void;
  onClick?: () => void;
  size?: "lg" | "md" | "sm";
  emoji?: string | null;
  imageUrl?: string;
  id?: string;
}

function seededRandom(a: number, b: number, c: number, d: number) {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
}

async function getDefaultAvatarImg(id: string): Promise<Blob | undefined> {
  const canvas = new OffscreenCanvas(100, 100);
  const ctx = canvas.getContext("2d");
  if (!ctx) return undefined;

  const seed = quickHash(id);
  const rand = seededRandom(...seed);

  const baseHue = Math.floor(rand() * 255);

  for (let x = 0; x < 100; x += 20) {
    for (let y = 0; y < 100; y += 20) {
      let lightOffset = Math.floor(rand() * 25);
      if (rand() > 0.5) lightOffset *= -1;

      const hueOffset = Math.floor(rand() * 25);

      ctx.fillStyle = `hsl(${baseHue + hueOffset}, 50%, ${80 + lightOffset}%)`;
      ctx.fillRect(x, y, 20, 20);
    }
  }

  return await canvas.convertToBlob();
}

export function ProfileImage({
  onChange,
  onClick,
  size = "md",
  emoji,
  imageUrl,
  id,
}: ProfileImageProps) {
  const htmlForID = useRef(uuid());

  const [defaultImage, setDefaultImage] = useState<string>("");

  useEffect(() => {
    if (imageUrl || !id) return;

    (async () => {
      const newDefImage = await getDefaultAvatarImg(id);
      if (!newDefImage) return;

      setDefaultImage(URL.createObjectURL(newDefImage));
    })();
  }, [imageUrl, id]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onChange) return;
    const imageFile = e.target.files[0];
    onChange?.(imageFile);
  };

  if (onChange) {
    return (
      <>
        <label
          className={classNames(
            "profile-image",
            !!onChange && "editing",
            imageUrl && "image",
            size
          )}
          htmlFor={`profile-image-${htmlForID.current}`}
          style={{}}
        >
          <img src={imageUrl || defaultImage} />
        </label>
        <input
          style={{ display: "none" }}
          type="file"
          id={`profile-image-${htmlForID.current}`}
          accept="image/*"
          onChange={handleFileChange}
          disabled={!onChange}
        />
      </>
    );
  }

  return (
    <div
      className={classNames(
        "profile-image",
        emoji && "emoji",
        imageUrl && "image",
        size
      )}
      onClick={onClick}
    >
      {emoji ? <span>{emoji}</span> : <img src={imageUrl || defaultImage} />}
    </div>
  );
}
