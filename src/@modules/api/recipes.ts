import { child, ref, getDatabase, push, onValue, set, remove, update, query, orderByChild, equalTo, DataSnapshot } from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { authStore } from "../stores/auth";

import { Recipe, setRecipeDefaults } from "../types/recipes";

import { app } from "./firebase";
import { addItemID, addListIDs, formatSnapList, stripItemID } from "./utils";

export interface RecipeRefParams {
  userId?: string,
  workspaceId?: string,
  recipeId?: string,
}

function getRecipeRef({ userId, workspaceId, recipeId }: RecipeRefParams = {}) {
  let currentRef = ref(getDatabase(app));

  if (userId && workspaceId) {
    currentRef = child(currentRef, `${userId}/workspaceRecipes/${workspaceId}`);
  } else if (userId) {
    currentRef = child(currentRef, `${userId}/recipes`);
  } else {
    const { user } = getRecoil(authStore);
    if (!user) throw "User is not logged in";

    currentRef = child(currentRef, `${user.uid}/recipes`);
  }

  if (recipeId) {
    return child(currentRef, recipeId);
  }

  return currentRef;
}

export function getRecipesWithParent(params: RecipeRefParams, parent: string | undefined, callback: (recipes: Recipe[]) => void) {
  const recipesRef = query(getRecipeRef(params), orderByChild("parent"), equalTo(parent || null));

  return onValue(recipesRef, (snapshot) => {
    callback(formatSnapList(snapshot, formatAndCacheRecipe));
  });
}

export function getRecipe(params: RecipeRefParams, callback: (recipe?: Recipe) => void) {
  if (!params.recipeId) {
    callback(undefined);
    return () => undefined;
  }

  console.log(params);

  return onValue(getRecipeRef(params), (snapshot) => {
    callback(formatAndCacheRecipe(snapshot));
  });
}

export function formatAndCacheRecipe(snapshot: DataSnapshot) {
  let recipe = addItemID<Recipe>(snapshot);
  if (!recipe) return recipe;

  recipe = setRecipeDefaults(recipe);
  sessionStorage.setItem(`/recipe/${recipe._id}`, JSON.stringify(recipe));
  return recipe;
}


export function getRecipesLive(callback: (r: Recipe[]) => void) {
  return onValue(getRecipeRef(), (snapshot) => {
    callback(
      addListIDs<Recipe>(snapshot)
        .map(setRecipeDefaults)
    );
  });
}

export const saveRecipe = debounce((params: RecipeRefParams, recipe: Recipe) => {
  return set(getRecipeRef(params), stripItemID(setRecipeDefaults(recipe)));
}, 500);

export async function newRecipe(params: RecipeRefParams, r: Partial<Recipe>) {
  return await push(getRecipeRef(params), stripItemID(setRecipeDefaults(r))).key;
}

export async function deleteRecipe(params: RecipeRefParams) {
  return await remove(getRecipeRef(params));
}

export async function batchUpdateRecipes(params: RecipeRefParams, updates: Record<string, Recipe | null>) {
  return await update(getRecipeRef(params), updates);
}