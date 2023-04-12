
import { atom } from "recoil";

export const navStore = atom<{ topShadow: boolean, bottomShadow: boolean }>({
  key: "navStore",
  default: { topShadow: false, bottomShadow: false }
});