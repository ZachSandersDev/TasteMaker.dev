import { atom } from "recoil";
import debounce from "lodash/debounce"
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  User
} from "firebase/auth";

import { app } from "../api/firebase";
import { setRecoil } from "recoil-nexus";

export const authStore = atom<User>({
  key: 'authStore',
  default: undefined
});


export function listenForAuth() {
  const auth = getAuth(app);

  let alreadyTried = false

  onAuthStateChanged(auth, debounce(async (user) => {
    if (alreadyTried) return;

    if (user) {
      setRecoil(authStore, user);
    } else {
      const provider = new GoogleAuthProvider();
      alreadyTried = true;
      try {
        const { user } = await signInWithPopup(auth, provider)
        setRecoil(authStore, user);
      } catch (err) {
        signInWithRedirect(auth, provider)
      }
    }
  }, 200));
}
