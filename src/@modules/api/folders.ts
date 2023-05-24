import { child, ref, getDatabase, push, onValue, set, remove, update, query, orderByChild, equalTo, DataSnapshot } from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { Folder, setFolderDefaults } from "../types/folder";

import { app } from "./firebase";
import { addItemID, addListIDs, formatSnapList, stripItemID } from "./utils";

export interface FolderRefParams {
  userId?: string,
  workspaceId?: string,
  folderId?: string,
}

function getFolderRef({ userId, workspaceId, folderId }: FolderRefParams = {}) {
  let currentRef = ref(getDatabase(app));

  if (userId && workspaceId) {
    currentRef = child(currentRef, `${userId}/workspaceFolders/${workspaceId}`);
  } else if (userId) {
    currentRef = child(currentRef, `${userId}/workspaceFolders/${workspaceId}`);
  } else {
    const { user } = getRecoil(authStore);
    if (!user) throw "User is not logged in";

    currentRef = child(currentRef, `${user.uid}/folders`);
  }

  if (folderId) {
    return child(currentRef, folderId);
  }

  return currentRef;
}

export function getFoldersWithParent(params: FolderRefParams, parent: string | undefined, callback: (folders: Folder[]) => void) {
  const foldersRef = query(getFolderRef(params), orderByChild("parent"), equalTo(parent || null));

  return onValue(foldersRef, (snapshot) => {
    callback(formatSnapList(snapshot, formatAndCacheFolder));
  });
}

export function getFolder(params: FolderRefParams, callback: (folder?: Folder) => void) {
  if (!params.folderId) {
    callback(undefined);
    return () => undefined;
  }

  return onValue(getFolderRef(params), (snapshot) => {
    callback(formatAndCacheFolder(snapshot));
  });
}


export function getFoldersLive(callback: (r: Folder[]) => void) {
  return onValue(getFolderRef(), (snapshot) => {
    callback(
      addListIDs<Folder>(snapshot)
        .map(setFolderDefaults)
    );
  });
}

export const saveFolder = debounce((params: FolderRefParams, folder: Folder) => {
  return set(getFolderRef(params), stripItemID(setFolderDefaults(folder)));
}, 500);

export async function newFolder(params: FolderRefParams, r: Partial<Folder>) {
  return await push(getFolderRef(params), stripItemID(setFolderDefaults(r))).key;
}

export async function deleteFolder(params: FolderRefParams) {
  return await remove(getFolderRef(params));
}

export async function batchUpdateFolders(params: FolderRefParams, updates: Record<string, Folder | null>) {
  return await update(getFolderRef(params), updates);
}

export function formatAndCacheFolder(snapshot: DataSnapshot) {
  const folder = setFolderDefaults(addItemID<Folder>(snapshot));
  sessionStorage.setItem(`/folder/${folder._id}`, JSON.stringify(folder));
  return folder;
}