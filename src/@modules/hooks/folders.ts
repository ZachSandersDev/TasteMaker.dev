import {
  FolderRefParams,
  getFolder,
  getFoldersWithParent,
  saveFolder,
} from "../api/folders";
import { Folder } from "../types/folder";
import { useSWR } from "../utils/cache.react";

export function getFolderCacheKey({
  userId,
  workspaceId,
  folderId,
}: FolderRefParams) {
  return `${userId}/${workspaceId}/folders/${folderId}`;
}

export function useFolder(folderParams: FolderRefParams) {
  const {
    loading: folderLoading,
    value: folder,
    updateValue: updateFolder,
  } = useSWR<Folder>(
    getFolderCacheKey(folderParams),
    () => getFolder(folderParams),
    (newFolder) => saveFolder(folderParams, newFolder)
  );

  return { folderLoading, folder, updateFolder };
}

export function useFoldersWithParent(folderParams: FolderRefParams) {
  const { userId, workspaceId, folderId } = folderParams;

  const {
    loading: foldersLoading,
    value: folders,
    revalidate: revalidateFolders,
  } = useSWR<Folder[]>(
    `${userId}/${workspaceId}/foldersWithParent/${folderId}`,
    () => getFoldersWithParent({ userId, workspaceId }, folderId)
  );

  return { foldersLoading, folders, revalidateFolders };
}
