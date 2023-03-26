import type { DataSnapshot } from "firebase/database";

export function stripItemID<T extends { _id: string }>(item: T) {
  const val: any = item;
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
