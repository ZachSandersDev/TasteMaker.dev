import { useRecoilState } from "recoil";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { deleteImage, uploadProfileImage } from "../../@modules/api/files";
import { saveProfile } from "../../@modules/api/profile";
import { doLogout } from "../../@modules/stores/auth";
import { profileStore } from "../../@modules/stores/profile";
import useUpdater from "../../@modules/utils/useUpdater";
import AppView from "../../components/AppView";

import { ProfileImage } from "./ProfileImage";

import "./SettingsView.scss";

export default function SettingsView() {
  const [{ profile }, setProfileState] = useRecoilState(profileStore);
  const updateProfile = useUpdater(profile || {}, (newProfile) => {
    setProfileState((state) => ({ ...state, profile: newProfile }));
    saveProfile(newProfile);
  });

  const handleNewProfileImage = async (imageFile: File) => {
    const newImage = await uploadProfileImage(imageFile);
    if (profile?.image?.imageUrl) {
      deleteImage(profile.image?.imageUrl);
    }
    updateProfile((r) => (r.image = newImage));
  };

  return (
    <AppView>
      <header className="ra-header">
        <h2 className="ra-title">My Profile:</h2>
      </header>

      <div className="profile-image-container">
        <ProfileImage size="lg" onChange={handleNewProfileImage} />
        <MultilineInput
          className="ra-title"
          value={profile?.displayName || ""}
          placeholder="Anonymous User"
          onChange={(name) => updateProfile((p) => (p.displayName = name))}
          variant="naked"
        />
      </div>

      <button
        className="settings-option"
        style={{ color: "var(--color-danger)" }}
        onClick={doLogout}
      >
        Log out
      </button>
    </AppView>
  );
}
