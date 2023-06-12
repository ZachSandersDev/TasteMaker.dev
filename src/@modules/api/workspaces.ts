import { child, ref, getDatabase, onValue, DataSnapshot, push, set, update } from "firebase/database";
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

function getUserId({ userId, workspaceId }: WorkspaceRefParams = {}) {
  if (userId) return userId;

  const { user } = getRecoil(authStore);
  if (!user) throw "User is not logged in";

  return user.uid;
}

function getWorkspaceRef(params: WorkspaceRefParams = {}) {
  const userId = getUserId(params);
  const currentRef = child(ref(getDatabase(app)), `${userId}/workspaces`);

  if (params.workspaceId) {
    return child(currentRef, params.workspaceId);
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

export const saveWorkspace = debounce((params: WorkspaceRefParams, workspace: Workspace) => {
  return set(getWorkspaceRef(params), stripItemID(setWorkspaceDefaults(workspace)));
}, 500);

export async function newWorkspace(newWorkspace: Partial<Workspace>) {
  return await push(getWorkspaceRef(), stripItemID(setWorkspaceDefaults(newWorkspace))).key;
}

export async function deleteWorkspace(params: WorkspaceRefParams) {
  if (!params.workspaceId) throw "Workspace ID not provided";

  const userId = getUserId(params);

  const batch = {
    [`${userId}/workspaces/${params.workspaceId}`]: null,
    [`${userId}/workspaceFolders/${params.workspaceId}`]: null,
    [`${userId}/workspaceRecipes/${params.workspaceId}`]: null
  };

  return await update(ref(getDatabase(app)), batch);
}


// export async function batchUpdateWorkspaces(updates: Record<string, Workspace | null>) {
//   return await update(getWorkspaceRef(), updates);
// }

export function formatAndCacheWorkspace(snapshot: DataSnapshot) {
  const workspace = setWorkspaceDefaults(addItemID<Workspace>(snapshot));
  sessionStorage.setItem(`/workspace/${workspace._id}`, JSON.stringify(workspace));
  return workspace;
}