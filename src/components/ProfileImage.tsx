import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

import classNames from "../@modules/utils/classNames";

import "./ProfileImage.scss";

export interface ProfileImageProps {
  onChange?: (image: File) => void;
  size?: "lg" | "md" | "sm";
  imageUrl?: string;
  id?: string;
}

function getHash(str: string): [number, number, number, number] {
  let h1 = 1779033703,
    h2 = 3144134277,
    h3 = 1013904242,
    h4 = 2773480762;
  for (let i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  return [
    (h1 ^ h2 ^ h3 ^ h4) >>> 0,
    (h2 ^ h1) >>> 0,
    (h3 ^ h1) >>> 0,
    (h4 ^ h1) >>> 0,
  ];
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

  const seed = getHash(id);
  const rand = seededRandom(...seed);

  const baseHue = Math.floor(rand() * 255);

  for (let x = 0; x < 100; x += 20) {
    for (let y = 0; y < 100; y += 20) {
      let hueOffset = Math.floor(rand() * 50);
      if (rand() > 0.5) hueOffset *= -1;

      ctx.fillStyle = `hsl(${baseHue + hueOffset * 0.25}, 80%, ${
        80 + hueOffset * 0.35
      }%)`;
      ctx.fillRect(x, y, 20, 20);
    }
  }

  return await canvas.convertToBlob();
}

export function ProfileImage({
  onChange,
  size = "md",
  imageUrl,
  id,
}: ProfileImageProps) {
  const htmlForID = useRef(uuid());

  const [defaultImage, setDefaultImage] = useState<string>("");

  useEffect(() => {
    if (imageUrl || !id) return;

    (async () => {
      const newDefImage = await getDefaultAvatarImg(id);
      console.log(newDefImage);
      if (!newDefImage) return;

      setDefaultImage(URL.createObjectURL(newDefImage));
    })();
  }, [imageUrl, id]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !onChange) return;
    const imageFile = e.target.files[0];
    onChange?.(imageFile);
  };

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
        {/* <div className="profile-image-upload-wrapper">
          <i className="material-symbols-rounded"></i>
        </div> */}
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
