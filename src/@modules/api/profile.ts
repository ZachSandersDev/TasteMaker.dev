import { child, ref, getDatabase, onValue, get, set } from "firebase/database";
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

function getProfileRef(userId: string) {
  const db = ref(getDatabase(app));
  return child(db, `${userId}/profile`);
}

export function getMyProfileLive(callback: (r: Profile) => void) {
  return onValue(getMyProfileRef(), (snapshot) => {
    callback(snapshot.val());
  });
}

export async function getProfile(userId: string) {
  const data = await get(getProfileRef(userId));
  return setProfileDefaults(data.val());
}

export const saveProfile = debounce((profile: Profile) => {
  return set(getMyProfileRef(), setProfileDefaults(profile));
}, 500);