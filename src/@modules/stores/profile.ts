
import { setRecoil } from "recoil-nexus";

import { getMyProfileLive } from "../api/profile";
import { Profile } from "../types/profile";
import persistentAtom from "../utils/persistentAtom";

const PROFILE_PERSIST_KEY = "tm-profile-store";

export const profileStore = persistentAtom<{ loading: boolean, profile?: Profile }>({
  key: "profileStore",
  default: { loading: false, profile: undefined }
}, PROFILE_PERSIST_KEY, "profile");

export function listenForMyProfile() {
  if (!localStorage.getItem(PROFILE_PERSIST_KEY)) {
    setRecoil(profileStore, (state) => ({ ...state, loading: true }));
  }

  const listener = getMyProfileLive((profiles) => {
    setRecoil(profileStore, (state) => ({ ...state, profiles, loading: false }));
  });

  return () => {
    listener();
    setRecoil(profileStore, () => ({ profiles: [], loading: false }));
  };
}
