import { atom, useRecoilValue } from "recoil";
import { getRecoil, setRecoil } from "recoil-nexus";

import { getTreeLive } from "../api/tree";
import { TreeNode } from "../types/treeNode";

export const treeStore = atom<{ listener: () => void, tree: TreeNode[], loading: boolean }>({
  key: "treeStore",
  default: { listener: () => undefined, loading: false, tree: [] }
});

export function listenForTree() {
  const listener = getTreeLive((tree) => {
    setRecoil(treeStore, (state) => ({ ...state, tree, loading: false }));
  });

  setRecoil(treeStore, (state) => ({ ...state, loading: true, listener }));
}

export function useTreeNode(treeNodeId: string) {
  const { tree } = useRecoilValue(treeStore);
  return structuredClone(tree.find(tn => tn.id === parseInt(treeNodeId)));
}

export function setLocalTree(newTree: TreeNode[]) {
  setRecoil(treeStore, (state) => ({ ...state, tree: newTree }));
}

export function getBreadcrumbs(folderId: string | number) {
  const { tree } = getRecoil(treeStore);
  const treeMap = tree.reduce((m, n) => {
    m[String(n.id)] = n;
    return m;
  }, {} as Record<string, TreeNode>);

  const folderStack: TreeNode[] = [];

  let currId = String(folderId);
  while (currId !== "-1") {
    const currNode = treeMap[currId];
    if (!currNode) throw new Error("Could not find node " + currId);

    folderStack.push(currNode);
    currId = String(currNode.parent);
  }

  return folderStack.reverse();
}
