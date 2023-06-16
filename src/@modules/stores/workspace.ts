import { atom } from "recoil";

const WORKSPACE_CACHE_KEY = "workspaceStore";

export const workspaceStore = atom<{
  userId?: string;
  workspaceId?: string;
}>({
  key: "workspaceStore",
  default: JSON.parse(localStorage.getItem(WORKSPACE_CACHE_KEY) || "0") || {},
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem(WORKSPACE_CACHE_KEY, JSON.stringify(newValue));
      });
    },
  ],
});
