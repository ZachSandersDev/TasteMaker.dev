import { child, ref, getDatabase, push, onValue, get, set, remove, update } from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { Folder, setFolderDefaults } from "../types/folder";

import { app } from "./firebase";
import { addItemID, addListIDs, stripItemID } from "./utils";

function getFolderRef() {
  const { user } = getRecoil(authStore);

  if (!user) throw "User is not logged in";

  const db = ref(getDatabase(app));
  return child(db, `${user.uid}/folders`);
}

export function getFoldersLive(callback: (r: Folder[]) => void) {
  return onValue(getFolderRef(), (snapshot) => {
    callback(
      addListIDs<Folder>(snapshot)
        .map(setFolderDefaults)
    );
  });
}

export async function getFolder(folderId: string) {
  const data = await get(child(getFolderRef(), folderId));
  return setFolderDefaults(addItemID<Folder>(data));
}

export const saveFolder = debounce((folder: Folder) => {
  return set(child(getFolderRef(), folder._id), stripItemID(setFolderDefaults(folder)));
}, 500);

export async function newFolder(newFolder: Folder) {
  return await push(getFolderRef(), stripItemID(newFolder)).key;
}

export async function deleteFolder(folderId: string) {
  return await remove(child(getFolderRef(), folderId));
}

export async function batchUpdateFolders(updates: Record<string, Folder | null>) {
  return await update(getFolderRef(), updates);
}