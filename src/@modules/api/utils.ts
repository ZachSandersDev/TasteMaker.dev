import type { DataSnapshot } from "firebase/database";

export function stripItemID<T extends { _id: string }>(item: T) {
  const val: any = structuredClone(item);
  delete val._id;
  return val;
}

export function addItemID<T extends { _id: string }>(snap: DataSnapshot) {
  const val: T = snap.val();
  if (!val) return val;
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

export function addRecordIDs<T extends { _id: string }>(snap: DataSnapshot, formatter: (v: Partial<T>) => T): Record<string, T> {
  const values: Record<string, T> = {};
  snap.forEach((child) => {
    const newValue = addItemID<T>(child);
    values[newValue._id] = formatter(newValue);
  });
  return values;
}

export function formatSnapList<T>(snap: DataSnapshot, formatter: (val: DataSnapshot) => T) {
  const values: T[] = [];
  snap.forEach((child) => {
    values.push(formatter(child));
  });
  return values;
}