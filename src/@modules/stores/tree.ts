import { atom, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import { getTreeLive } from "../api/tree";
import { TreeNode } from "../types/treeNode";

export const treeStore = atom<{ listener: () => void, tree: TreeNode[] }>({
  key: 'treeStore',
  default: { listener: () => undefined, tree: [] }
});

export function listenForTree() {
  const listener = getTreeLive((tree) => {
    setRecoil(treeStore, (state) => ({ ...state, tree }))
  })

  setRecoil(treeStore, (state) => ({ ...state, listener }))
}

export function setLocalTree(newTree: TreeNode[]) {
  setRecoil(treeStore, (state) => ({ ...state, tree: newTree }))
}
