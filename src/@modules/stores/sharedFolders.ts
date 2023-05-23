import { Unsubscribe } from "firebase/database";
import { useRecoilState } from "recoil";

import { setRecoil } from "recoil-nexus";

import { getMyWorkspacesLive } from "../api/workspaces";
import { Workspace } from "../types/workspaces";
import persistentAtom from "../utils/persistentAtom";

const WORKSPACES_PERSIST_KEY = "tm-workspaces-store";

export interface LoadableField<T> {
  loading: boolean;
  // unsubscribe?: () => void;
  data?: T;
}

export interface WorkspaceState {
  // joinedWorkspaces: LoadableField<Record<string, JoinedWorkspace[]>>;
  workspaces: LoadableField<Record<string, Workspace>>;
}

export const workspaceStore = persistentAtom<LoadableField<Record<string, Workspace>>>({
  key: "workspaceStore",
  default: {
    loading: false
  }
}, WORKSPACES_PERSIST_KEY, "data");

export function listenForWorkspaces() {
  const listeners: Unsubscribe[] = [];

  if (!localStorage.getItem(WORKSPACES_PERSIST_KEY)) {
    setRecoil(workspaceStore, (state) => ({ ...state, loading: true }));
  }

  const myWorkspaceListener = getMyWorkspacesLive((workspaces) => {
    setRecoil(workspaceStore, () => ({ loading: false, data: workspaces }));
  });

  listeners.push(myWorkspaceListener);

  return () => {
    listeners.forEach(l => l());
    setRecoil(workspaceStore, () => ({ loading: false }));
  };
}

export function useWorkspace(workspaceId: string): [Workspace | undefined, (newWorkspace: Workspace) => void] {
  const [state, setState] = useRecoilState(workspaceStore);
  const { data: workspaces = {} } = state;

  if (!workspaceId) {
    return [undefined, () => undefined];
  }

  const updateWorkspace = (newWorkspace: Workspace) => {
    const newState = structuredClone(state);
    newState.data![newWorkspace._id] = newWorkspace;
    setState(newState);
  };

  const workspace = workspaces[workspaceId];
  return [workspace ? structuredClone(workspace) : undefined, updateWorkspace];
}