import { useEffect, useRef, useState } from "react";

import { FolderRefParams, getFolder } from "../api/folders";
import { getFolderCacheKey } from "../hooks/folders";
import { Folder } from "../types/folder";

import { swr } from "./cache";

export interface BreadcrumbLink {
  text: string;
  href?: string;
}

export function useBreadcrumbs(
  { userId, workspaceId, folderId }: FolderRefParams,
  isRecipe?: boolean
): BreadcrumbLink[] {
  const listeners = useRef<(() => void)[]>([]);

  const [folders, setFolders] = useState<Record<string, Folder>>({});

  const listenForFolder = (folderId: string) => {
    if (folders[folderId]) return;

    const listener = swr(
      getFolderCacheKey({ userId, workspaceId, folderId }),
      () => getFolder({ userId, workspaceId, folderId }),
      ({ value: folder }) => {
        if (!folder) return;
        setFolders((folders) => ({ ...folders, [folder._id]: folder }));

        if (folder.parent) {
          listenForFolder(folder.parent);
        }
      }
    );

    listeners.current.push(listener);
  };

  useEffect(() => {
    if (!folderId) return;
    console.log("Fresh start");
    listenForFolder(folderId);

    return () => {
      listeners.current.forEach((l) => l());
      listeners.current = [];
      setFolders({});
    };
  }, [folderId]);

  const breadcrumbs: BreadcrumbLink[] = [];

  let currentFolder: string | undefined = folderId;
  do {
    if (!currentFolder || !folders[currentFolder]) {
      return [];
    }

    const folder = folders[currentFolder];
    breadcrumbs.push({
      text: folder.text || "Untitled Folder",
      href:
        folder._id !== folderId || isRecipe
          ? `/folder/${folder._id}`
          : undefined,
    });
    currentFolder = folder.parent;
  } while (currentFolder);

  breadcrumbs.push({
    text: "Recipes",
    href: "/",
  });
  breadcrumbs.reverse();

  return breadcrumbs;
}
