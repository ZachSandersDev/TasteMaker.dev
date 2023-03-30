import { atom } from "recoil";
import debounce from "lodash/debounce"
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPopup,
  signInWithRedirect,
  User
} from "firebase/auth";

import { app } from "../api/firebase";
import { setRecoil } from "recoil-nexus";

export const authStore = atom<{ loading: boolean, user?: User }>({
  key: 'authStore',
  default: { loading: false, user: undefined }
});

export function listenForAuth() {
  const auth = getAuth(app);

  let alreadyTried = false
  setRecoil(authStore, state => ({ ...state, loading: true }));

  onAuthStateChanged(auth, debounce(async (user) => {
    if (user) {
      setRecoil(authStore, { loading: false, user });
    } else if (alreadyTried) {
      return;
    } else if (import.meta.env.PROD) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(auth, provider)
        alreadyTried = true;
      } catch (err) {
        signInWithRedirect(auth, provider)
        alreadyTried = true;
      }
    } else {
      signInAnonymously(auth)
      alreadyTried = true;
    }
  }, 200));
}
