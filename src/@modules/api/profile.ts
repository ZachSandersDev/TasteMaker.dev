import { child, ref, getDatabase, onValue, set } from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { Profile, setProfileDefaults } from "../types/profile";

import { app } from "./firebase";

function getMyProfileRef() {
  const { user } = getRecoil(authStore);
  if (!user) throw "User is not logged in";

  return getProfileRef(user.uid);
}

export function getMyProfileLive(callback: (r: Profile) => void) {
  return onValue(getMyProfileRef(), (snapshot) => {
    callback(snapshot.val());
  });
}

export const saveProfile = debounce((profile: Profile) => {
  return set(getMyProfileRef(), setProfileDefaults(profile));
}, 500);

//---//

function getProfileRef(userId: string) {
  const db = ref(getDatabase(app));
  return child(db, `${userId}/profile`);
}

export function getProfile(userId: string, callback: (r: Profile) => void) {
  return onValue(getProfileRef(userId), (snapshot) => {
    callback(snapshot.val());
  });
}