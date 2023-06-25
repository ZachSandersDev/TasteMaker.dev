import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import debounce from "lodash/debounce";
import { setRecoil } from "recoil-nexus";

import { app } from "../api/firebase";
import persistentAtom from "../utils/persistentAtom";

import { loadAllData, unloadAllData } from "./dataLoader";

const AUTH_PERSIST_KEY = "tm-auth-store";

export const authStore = persistentAtom<{ loading: boolean; user?: User }>(
  {
    key: "authStore",
    default: { loading: true, user: undefined },
  },
  AUTH_PERSIST_KEY,
  "user"
);

export function listenForAuth() {
  const auth = getAuth(app);

  if (!localStorage.getItem(AUTH_PERSIST_KEY)) {
    setRecoil(authStore, (state) => ({ ...state, loading: true }));
  } else {
    loadAllData();
  }

  return onAuthStateChanged(
    auth,
    debounce(async (user) => {
      if (user) {
        setRecoil(authStore, (state) => ({ ...state, loading: false, user }));
        loadAllData();
      } else {
        setRecoil(authStore, (state) => ({
          ...state,
          loading: false,
          user: undefined,
        }));
        unloadAllData();
      }
    }, 200)
  );
}

export async function doLogin(email: string, password: string) {
  const auth = getAuth(app);
  await signInWithEmailAndPassword(auth, email, password);
}

export async function createAccount(email: string, password: string) {
  const auth = getAuth(app);
  await createUserWithEmailAndPassword(auth, email, password);
}

export async function doLogout() {
  const auth = getAuth(app);
  return signOut(auth);
}
