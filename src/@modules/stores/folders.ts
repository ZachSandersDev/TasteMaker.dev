import { atom, useRecoilValue } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

import { getFoldersLive } from "../api/folders";
import { Folder } from "../types/folder";

export const folderStore = atom<{ listener: () => void, folders: Folder[], loading: boolean }>({
  key: "folderStore",
  default: { listener: () => undefined, loading: false, folders: [] }
});

export function listenForFolders() {
  const listener = getFoldersLive((folders) => {
    setRecoil(folderStore, (state) => ({ ...state, folders, loading: false }));
  });

  setRecoil(folderStore, (state) => ({ ...state, loading: true, listener }));
}

export function useFolder(folderId: string) {
  const { folders } = useRecoilValue(folderStore);
  return structuredClone(folders.find(f => f._id === folderId));
}

export function getBreadcrumbs(folderId: string) {
  const { folders } = getRecoil(folderStore);
  const folderMap = folders.reduce((m, f) => {
    m[f._id] = f;
    return m;
  }, {} as Record<string, Folder>);

  const folderStack: Folder[] = [];

  let currId: string | undefined = folderId;
  while (currId) {
    const curr = folderMap[currId];
    if (!curr) throw new Error("Could not find node " + currId);

    folderStack.push(curr);
    currId = curr.parent;
  }

  return folderStack.reverse();
}
