import { atom, useSetRecoilState } from "recoil";
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

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      setRecoil(authStore, user);
    } else {
      const provider = new GoogleAuthProvider();
      try {
        const { user } = await signInWithPopup(auth, provider)
        setRecoil(authStore, user);
      } catch (err) {
        signInWithRedirect(auth, provider)
      }
    }
  });
}
