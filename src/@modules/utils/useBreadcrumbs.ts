import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";

import { FolderRefParams, getFolder } from "../api/folders";
import { Folder } from "../types/folder";

import { swrOnce } from "./cache";

export interface BreadcrumbLink {
  text: string;
  href?: string;
}

export function useBreadcrumbs(params: FolderRefParams, isRecipe?: boolean) {
  const [folders, setFolders] = useState<Record<string, Folder>>({});

  const revalidateBreadcrumbs = async () => {
    const folderRecord = { ...folders };
    let currentFolder: string | undefined = params.folderId;

    while (currentFolder) {
      const folder =
        folderRecord[currentFolder] ||
        (await swrOnce(`/folders/${currentFolder}`, () =>
          getFolder({ ...params, folderId: currentFolder })
        ));

      if (folder) {
        folderRecord[folder._id] = folder;
        currentFolder = folder.parent;
      } else {
        throw new Error("Could not fetch folder");
      }
    }

    if (!isEqual(folderRecord, folders)) {
      setFolders(folderRecord);
    }
  };

  useEffect(() => {
    revalidateBreadcrumbs();
  }, [params]);

  const breadcrumbs: BreadcrumbLink[] = [];

  let currentFolder: string | undefined = params.folderId;
  do {
    if (!currentFolder || !folders[currentFolder]) {
      return { breadcrumbs: [], revalidateBreadcrumbs };
    }

    const folder = folders[currentFolder];
    breadcrumbs.push({
      text: folder.text || "Untitled Folder",
      href:
        folder._id !== params.folderId || isRecipe
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

  return { breadcrumbs, revalidateBreadcrumbs };
}
