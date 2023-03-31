import { getRecoil } from "recoil-nexus";
import debounce from "lodash/debounce";
import { child, ref, getDatabase, push, onValue, get, set } from "firebase/database";

import { app } from "./firebase";
import { authStore } from "../stores/auth";

import { setListDefaults, ShoppingList } from "../types/shoppingLists";
import { addItemID, addListIDs, stripItemID } from "./utils";

function getListRef() {
  const { user } = getRecoil(authStore);

  if (!user) throw "User is not logged in";

  const db = ref(getDatabase(app));
  return child(db, `${user.uid}/shoppingLists`);
}

export function getListsLive(callback: (r: ShoppingList[]) => void) {
  return onValue(getListRef(), (snapshot) => {
    callback(
      addListIDs<ShoppingList>(snapshot)
        .map(setListDefaults)
    );
  });
}

export async function getList(recipeId: string) {
  const data = await get(child(getListRef(), recipeId));
  return setListDefaults(addItemID<ShoppingList>(data));
}

export const saveList = debounce((recipe: ShoppingList) => {
  return set(child(getListRef(), recipe._id), stripItemID(recipe));
}, 500);

export async function newList(r: ShoppingList) {
  return await push(getListRef(), stripItemID(r)).key;
}