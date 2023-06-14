import {
  child,
  ref,
  getDatabase,
  push,
  onValue,
  get,
  set,
  remove,
  DataSnapshot,
} from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { setListDefaults, ShoppingList } from "../types/shoppingLists";

import { app } from "./firebase";
import { addItemID, addListIDs, formatSnapList, stripItemID } from "./utils";

function getListRef(listId?: string) {
  const { user } = getRecoil(authStore);

  if (!user) throw "User is not logged in";

  const db = ref(getDatabase(app));
  const listsRef = child(db, `${user.uid}/shoppingLists`);

  if (listId) {
    return child(listsRef, listId);
  }

  return listsRef;
}

export function getListsLive(callback: (r: ShoppingList[]) => void) {
  return onValue(getListRef(), (snapshot) => {
    callback(addListIDs<ShoppingList>(snapshot).map(setListDefaults));
  });
}

export function getShoppingList(
  listId: string
): Promise<ShoppingList | undefined> {
  if (!listId) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    onValue(
      getListRef(listId),
      (snapshot) => {
        resolve(formatShoppingList(snapshot));
      },
      (error) => {
        console.error(error);
        resolve(undefined);
      },
      { onlyOnce: true }
    );
  });
}

export function getShoppingLists(): Promise<ShoppingList[] | undefined> {
  return new Promise((resolve) => {
    onValue(
      getListRef(),
      (snapshot) => {
        resolve(formatSnapList(snapshot, formatShoppingList));
      },
      (error) => {
        console.error(error);
        resolve(undefined);
      },
      { onlyOnce: true }
    );
  });
}

export const saveShoppingList = debounce((list: ShoppingList) => {
  return set(getListRef(list._id), stripItemID(list));
}, 500);

export function formatShoppingList(snapshot: DataSnapshot) {
  const recipe = addItemID<ShoppingList>(snapshot);
  if (!recipe) return recipe;

  return setListDefaults(recipe);
}

export async function getList(listId: string) {
  const data = await get(child(getListRef(), listId));
  return setListDefaults(addItemID<ShoppingList>(data));
}

export async function newList(r: ShoppingList) {
  return await push(getListRef(), stripItemID(r)).key;
}

export async function deleteList(listId: string) {
  return await remove(child(getListRef(), listId));
}
