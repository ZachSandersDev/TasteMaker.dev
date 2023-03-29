import { getRecoil } from "recoil-nexus";
import { child, ref, getDatabase, onValue, get, set } from "firebase/database";

import { app } from "./firebase";
import { authStore } from "../stores/auth";

import { TreeNode } from "../types/treeNode";
import { formatTreeSnap, stripItemIDTree } from "./utils";

function getTreeRef() {
  const user = getRecoil(authStore);
  if (!user) throw "User is not logged in";

  const db = ref(getDatabase(app));
  return child(db, `${user.uid}/tree`);
}

export function getTreeLive(callback: (r: TreeNode[]) => void) {
  return onValue(getTreeRef(), (snapshot) => {
    callback(formatTreeSnap(snapshot));
  });
}

export async function getTree(): Promise<TreeNode[]> {
  const data = await get(getTreeRef());
  return formatTreeSnap(data);
}

export function saveTree(tree: TreeNode[]) {
  return set(getTreeRef(), tree.map(stripItemIDTree));
}