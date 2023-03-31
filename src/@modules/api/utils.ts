import type { DataSnapshot } from "firebase/database";
import { TreeNode } from "../types/treeNode";

export function stripItemID<T extends { _id: string }>(item: T) {
  const val: any = structuredClone(item);
  delete val._id;
  return val;
}

export function addItemID<T extends { _id: string }>(snap: DataSnapshot) {
  const val: T = snap.val();
  val._id = snap.key ?? "";
  return val;
}

export function addListIDs<T extends { _id: string }>(snap: DataSnapshot) {
  const values: T[] = [];
  snap.forEach((child) => {
    values.push(addItemID(child));
  });
  return values;
}


export function addItemIDTree(snap: DataSnapshot) {
  const val: TreeNode = snap.val();
  val.id = parseInt(snap.key || "") ?? 0;
  return val;
}

export function stripItemIDTree(item: TreeNode) {
  const temp = structuredClone(item);
  // @ts-expect-error
  delete temp.id;
  return temp;
}

export function formatTreeSnap(snap: DataSnapshot) {
  const values: TreeNode[] = [];
  snap.forEach((child) => {
    values.push(addItemIDTree(child))
  });
  return values;
}
