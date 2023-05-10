import { atom, useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

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

export function useFolder(folderId?: string): [Folder | undefined, (newFolder: Folder) => void] {
  const [state, setState] = useRecoilState(folderStore);
  const { folders } = state;

  if (!folderId) {
    return [undefined, () => undefined];
  }

  const updateFolder = (newFolder: Folder) => {
    const folderIndex = folders.findIndex(r => r._id === newFolder._id);
    if (folderIndex === -1) throw "Folder not found";

    const newState = { ...state, folders: [...state.folders] };
    newState.folders[folderIndex] = newFolder;
    setState(newState);
  };

  const folder = folders.find(r => r._id === folderId);
  return [folder ? structuredClone(folder) : undefined, updateFolder];
}


export function useBreadcrumbStack(folderId?: string | null) {
  const { folders } = useRecoilValue(folderStore);

  if (!folderId) {
    return [];
  }

  const folderMap = folders.reduce((m, f) => {
    m[f._id] = f;
    return m;
  }, {} as Record<string, Folder>);

  const folderStack: Folder[] = [];

  let currId: string | undefined = folderId;
  while (currId) {
    const curr: Folder | undefined = folderMap[currId];
    if (!curr) throw new Error("Could not find node " + currId);

    folderStack.push(curr);
    currId = curr.parent;
  }

  return folderStack.reverse();
}
