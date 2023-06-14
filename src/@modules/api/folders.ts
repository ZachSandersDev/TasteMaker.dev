import {
  child,
  ref,
  getDatabase,
  push,
  onValue,
  set,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
} from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { Folder, setFolderDefaults } from "../types/folder";

import { setCachedValue } from "../utils/cache";

import { app } from "./firebase";
import { addItemID, addListIDs, formatSnapList, stripItemID } from "./utils";

export interface FolderRefParams {
  userId?: string;
  workspaceId?: string;
  folderId?: string;
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

export function getFoldersWithParent(
  params: FolderRefParams,
  parent: string | undefined
): Promise<Folder[]> {
  const foldersRef = query(
    getFolderRef(params),
    orderByChild("parent"),
    equalTo(parent || null)
  );

  return new Promise((resolve) => {
    return onValue(
      foldersRef,
      (snapshot) => {
        const folders = formatSnapList(snapshot, formatFolder);
        folders.forEach((folder) =>
          setCachedValue(`/folders/${folder._id}`, folder)
        );
        resolve(folders);
      },
      (error) => {
        console.error(error);
        resolve([]);
      },
      { onlyOnce: true }
    );
  });
}

export function getFolder(
  params: FolderRefParams
): Promise<Folder | undefined> {
  if (!params.folderId) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    onValue(
      getFolderRef(params),
      (snapshot) => {
        resolve(formatFolder(snapshot));
      },
      { onlyOnce: true }
    );
  });
}

export function getFoldersLive(callback: (r: Folder[]) => void) {
  return onValue(getFolderRef(), (snapshot) => {
    callback(addListIDs<Folder>(snapshot).map(setFolderDefaults));
  });
}

export const saveFolder = debounce(
  (params: FolderRefParams, folder: Folder) => {
    return set(getFolderRef(params), stripItemID(setFolderDefaults(folder)));
  },
  500
);

export async function newFolder(params: FolderRefParams, r: Partial<Folder>) {
  return await push(getFolderRef(params), stripItemID(setFolderDefaults(r)))
    .key;
}

export async function deleteFolder(params: FolderRefParams) {
  return await remove(getFolderRef(params));
}

export async function batchUpdateFolders(
  params: FolderRefParams,
  updates: Record<string, Folder | null>
) {
  return await update(getFolderRef(params), updates);
}

export function formatFolder(snapshot: DataSnapshot) {
  return setFolderDefaults(addItemID<Folder>(snapshot));
}
