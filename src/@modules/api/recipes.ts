import { getRecoil } from "recoil-nexus";
import { child, ref, getDatabase, push, onValue, get, set } from "firebase/database";

import { app } from "./firebase";
import { authStore } from "../stores/auth";

import { Recipe, setRecipeDefaults } from "../types/recipes";
import { addItemID, addListIDs, stripItemID } from "./utils";

function getRecipeRef() {
  const { user } = getRecoil(authStore);

  if (!user) throw "User is not logged in";

  const db = ref(getDatabase(app));
  return child(db, `${user.uid}/recipes`);
}

export function getRecipesLive(callback: (r: Recipe[]) => void) {
  return onValue(getRecipeRef(), (snapshot) => {
    callback(
      addListIDs<Recipe>(snapshot)
        .map(setRecipeDefaults)
    );
  });
}

export async function getRecipe(recipeId: string) {
  const data = await get(child(getRecipeRef(), recipeId));
  return setRecipeDefaults(addItemID<Recipe>(data));
}

export function saveRecipe(recipe: Recipe) {
  return set(child(getRecipeRef(), recipe._id), stripItemID(recipe));
}

export async function newRecipe(r: Recipe) {
  return await push(getRecipeRef(), stripItemID(r)).key;
}
