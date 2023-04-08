import { atom } from "recoil";
import debounce from "lodash/debounce"
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User
} from "firebase/auth";

import { app } from "../api/firebase";
import { setRecoil } from "recoil-nexus";

export const authStore = atom<{ loading: boolean, user?: User }>({
  key: 'authStore',
  default: { loading: true, user: undefined }
});

export function listenForAuth() {
  const auth = getAuth(app);

  setRecoil(authStore, state => ({ ...state, loading: true }));

  onAuthStateChanged(auth, debounce(async (user) => {
    if (user) {
      setRecoil(authStore, state => ({ ...state, loading: false, user }));
    } else {
      setRecoil(authStore, state => ({ ...state, loading: false, user: undefined }));
    }
  }, 200));
}

export async function doLogin(email: string, password: string) {
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password)
}

export async function createAccount(email: string, password: string) {
  const auth = getAuth(app);
  await createUserWithEmailAndPassword(auth, email, password)
}

export async function doLogout() {
  const auth = getAuth(app);
  return signOut(auth);
}