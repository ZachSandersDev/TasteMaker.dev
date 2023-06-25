import {
  child,
  ref,
  getDatabase,
  onValue,
  DataSnapshot,
  push,
  set,
  update,
  remove,
} from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";
import {
  JoinedWorkspace,
  Workspace,
  setWorkspaceDefaults,
} from "../types/workspaces";

import { app } from "./firebase";
import { addItemID, formatSnapList, stripItemID } from "./utils";

export interface WorkspaceRefParams {
  userId?: string;
  workspaceId?: string;
}

function getUserId({ userId }: WorkspaceRefParams = {}) {
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

export function getMyWorkspaces(): Promise<Workspace[] | undefined> {
  return new Promise((resolve) => {
    onValue(
      getWorkspaceRef(),
      (snapshot) => {
        resolve(formatSnapList(snapshot, formatWorkspace));
      },
      { onlyOnce: true }
    );
  });
}

export function getWorkspace(
  params: WorkspaceRefParams
): Promise<Workspace | undefined> {
  if (!params.workspaceId) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    onValue(
      getWorkspaceRef(params),
      (snapshot) => {
        resolve(formatWorkspace(snapshot));
      },
      { onlyOnce: true }
    );
  });
}

export const saveWorkspace = debounce(
  (params: WorkspaceRefParams, workspace: Workspace) => {
    return set(
      getWorkspaceRef(params),
      stripItemID(setWorkspaceDefaults(workspace))
    );
  },
  500
);

export async function newWorkspace(newWorkspace: Partial<Workspace>) {
  return await push(
    getWorkspaceRef(),
    stripItemID(setWorkspaceDefaults(newWorkspace))
  ).key;
}

export async function deleteWorkspace(params: WorkspaceRefParams) {
  if (!params.workspaceId) throw "Workspace ID not provided";

  const userId = getUserId(params);

  const batch = {
    [`${userId}/workspaces/${params.workspaceId}`]: null,
    [`${userId}/workspaceFolders/${params.workspaceId}`]: null,
    [`${userId}/workspaceRecipes/${params.workspaceId}`]: null,
  };

  return await update(ref(getDatabase(app)), batch);
}

// export async function batchUpdateWorkspaces(updates: Record<string, Workspace | null>) {
//   return await update(getWorkspaceRef(), updates);
// }

export function formatWorkspace(snapshot: DataSnapshot) {
  return setWorkspaceDefaults(addItemID<Workspace>(snapshot));
}

// --- //

function getJoinedWorkspacesRef() {
  const userId = getUserId();
  return child(ref(getDatabase(app)), `${userId}/joinedWorkspaces`);
}

export function getJoinedWorkspaces(): Promise<JoinedWorkspace[]> {
  return new Promise((resolve) => {
    onValue(
      getJoinedWorkspacesRef(),
      (snapshot) => {
        resolve(formatSnapList(snapshot, formatJoinedWorkspace));
      },
      { onlyOnce: true }
    );
  });
}

export function joinWorkspace(params: WorkspaceRefParams) {
  return push(getJoinedWorkspacesRef(), params);
}

export function leaveWorkspace(joinedWorkspaceId: string) {
  return remove(child(getJoinedWorkspacesRef(), joinedWorkspaceId));
}

export function formatJoinedWorkspace(snapshot: DataSnapshot) {
  return addItemID<JoinedWorkspace>(snapshot);
}
