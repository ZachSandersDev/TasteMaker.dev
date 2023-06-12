import { ChangeEvent, useRef } from "react";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { profileStore } from "../../@modules/stores/profile";
import { Profile } from "../../@modules/types/profile";
import classNames from "../../@modules/utils/classNames";

import "./ProfileImage.scss";

export interface ProfileImageProps {
  onChange?: (image: File) => void;
  size?: "lg" | "md" | "sm";
  profile?: Profile;
}

export function ProfileImage({
  onChange,
  size = "md",
  profile: propsProfile,
}: ProfileImageProps) {
  const { profile: myProfile } = useRecoilValue(profileStore);

  const profile = propsProfile || myProfile;

  const id = useRef(uuid());

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
          profile?.image?.imageUrl && "image",
          size
        )}
        htmlFor={`profile-image-${id.current}`}
        style={{}}
      >
        {profile?.image?.imageUrl && <img src={profile.image.imageUrl} />}
        <div className="profile-image-upload-wrapper">
          <i className="material-symbols-rounded"></i>
        </div>
      </label>
      <input
        style={{ display: "none" }}
        type="file"
        id={`profile-image-${id.current}`}
        accept="image/*"
        onChange={handleFileChange}
        disabled={!onChange}
      />
    </>
  );
}
