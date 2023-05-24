import { child, ref, getDatabase, onValue, DataSnapshot, push, set } from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";
import { Workspace, setWorkspaceDefaults } from "../types/workspaces";

import { app } from "./firebase";
import { addItemID, formatSnapList, stripItemID } from "./utils";

export interface WorkspaceRefParams {
  userId?: string,
  workspaceId?: string,
}

function getWorkspaceRef({ userId, workspaceId }: WorkspaceRefParams = {}) {
  let currentRef = ref(getDatabase(app));

  if (userId && workspaceId) {
    currentRef = child(currentRef, `${userId}/workspaces`);
  } else {
    const { user } = getRecoil(authStore);
    if (!user) throw "User is not logged in";

    currentRef = child(currentRef, `${user.uid}/workspaces`);
  }

  if (workspaceId) {
    return child(currentRef, workspaceId);
  }

  return currentRef;
}

export function getAllWorkspaces(callback: (workspaces?: Workspace[]) => void) {
  return onValue(getWorkspaceRef(), (snapshot) => {
    callback(formatSnapList(snapshot, formatAndCacheWorkspace));
  });
}

export function getWorkspace(params: WorkspaceRefParams, callback: (workspace?: Workspace) => void) {
  if (!params.workspaceId) {
    callback(undefined);
    return () => undefined;
  }

  return onValue(getWorkspaceRef(params), (snapshot) => {
    callback(formatAndCacheWorkspace(snapshot));
  });
}

export const saveWorkspace = debounce((workspace: Workspace) => {
  return set(getWorkspaceRef(), stripItemID(setWorkspaceDefaults(workspace)));
}, 500);

export async function newWorkspace(newWorkspace: Partial<Workspace>) {
  console.log({
    ref: getWorkspaceRef(),
    workspace: stripItemID(setWorkspaceDefaults(newWorkspace))
  });


  return await push(getWorkspaceRef(), stripItemID(setWorkspaceDefaults(newWorkspace))).key;
}

// export async function deleteWorkspace(workspaceId: string) {
//   return await remove(child(getWorkspaceRef(), workspaceId));
// }

// export async function batchUpdateWorkspaces(updates: Record<string, Workspace | null>) {
//   return await update(getWorkspaceRef(), updates);
// }

export function formatAndCacheWorkspace(snapshot: DataSnapshot) {
  const workspace = setWorkspaceDefaults(addItemID<Workspace>(snapshot));
  sessionStorage.setItem(`/workspace/${workspace._id}`, JSON.stringify(workspace));
  return workspace;
}