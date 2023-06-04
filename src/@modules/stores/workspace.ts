import { atom } from "recoil";

export const workspaceStore = atom<{ userId?: string, workspaceId?: string }>({
  key: "workspaceStore",
  default: {},
});
