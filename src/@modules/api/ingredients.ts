import { child, ref, getDatabase, onValue, remove, update } from "firebase/database";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { app } from "./firebase";

function getIngredientRef() {
  const { user } = getRecoil(authStore);

  if (!user) throw "User is not logged in";

  const db = ref(getDatabase(app));
  return child(db, `${user.uid}/ingredients`);
}

export function getIngredientsLive(callback: (ingredients: Record<string, true>) => void) {
  return onValue(getIngredientRef(), (snapshot) => {
    callback(snapshot.val() || {});
  });
}

export async function addIngredient(ingredient: string) {
  return update(getIngredientRef(), { [ingredient]: true });
}

export async function deleteIngredient(ingredient: string) {
  return remove(child(getIngredientRef(), ingredient));
}
