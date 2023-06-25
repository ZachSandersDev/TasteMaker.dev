import { useRecoilState, useRecoilValue } from "recoil";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { deleteImage, uploadProfileImage } from "../../@modules/api/files";
import { saveProfile } from "../../@modules/api/profile";
import { authStore, doLogout } from "../../@modules/stores/auth";
import { profileStore } from "../../@modules/stores/profile";
import useUpdater from "../../@modules/utils/useUpdater";
import AppView from "../../components/Global/AppView";

import "./SettingsView.scss";
import { ProfileImage } from "../../components/ProfileImage";

export default function SettingsView() {
  const { user } = useRecoilValue(authStore);
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
        <ProfileImage
          size="lg"
          imageUrl={profile?.image?.imageUrl}
          onChange={handleNewProfileImage}
          id={user?.uid}
        />
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
