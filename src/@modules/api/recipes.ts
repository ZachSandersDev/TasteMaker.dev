import {
  child,
  ref,
  getDatabase,
  push,
  onValue,
  set,
  remove,
  update,
  query,
  orderByChild,
  equalTo,
  DataSnapshot,
} from "firebase/database";
import debounce from "lodash/debounce";
import { getRecoil } from "recoil-nexus";

import { getRecipeCacheKey } from "../hooks/recipes";
import { authStore } from "../stores/auth";

import { Recipe, setRecipeDefaults } from "../types/recipes";

import { setCachedValue } from "../utils/cache";

import { app } from "./firebase";
import { addItemID, addListIDs, formatSnapList, stripItemID } from "./utils";

export interface RecipeRefParams {
  userId?: string;
  workspaceId?: string;
  recipeId?: string;
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

export function getRecipesWithParent(
  params: RecipeRefParams,
  parent: string | undefined
): Promise<Recipe[]> {
  const recipesRef = query(
    getRecipeRef(params),
    orderByChild("parent"),
    equalTo(parent || null)
  );

  return new Promise((resolve) => {
    return onValue(
      recipesRef,
      (snapshot) => {
        const recipes = formatSnapList(snapshot, formatRecipe);
        recipes.forEach((recipe) =>
          setCachedValue(getRecipeCacheKey(params), recipe)
        );
        resolve(recipes);
      },
      { onlyOnce: true }
    );
  });
}

export function getRecipe(
  params: RecipeRefParams
): Promise<Recipe | undefined> {
  if (!params.recipeId) {
    return Promise.resolve(undefined);
  }

  return new Promise((resolve) => {
    onValue(
      getRecipeRef(params),
      (snapshot) => {
        resolve(formatRecipe(snapshot));
      },
      (error) => {
        console.error(error);
        resolve(undefined);
      },
      { onlyOnce: true }
    );
  });
}

export function formatRecipe(snapshot: DataSnapshot) {
  const recipe = addItemID<Recipe>(snapshot);
  if (!recipe) return recipe;

  return setRecipeDefaults(recipe);
}

export function getRecipesLive(callback: (r: Recipe[]) => void) {
  return onValue(getRecipeRef(), (snapshot) => {
    callback(addListIDs<Recipe>(snapshot).map(setRecipeDefaults));
  });
}

export const saveRecipe = debounce(
  (params: RecipeRefParams, recipe: Recipe) => {
    return set(getRecipeRef(params), stripItemID(setRecipeDefaults(recipe)));
  },
  500
);

export async function newRecipe(params: RecipeRefParams, r: Partial<Recipe>) {
  return await push(getRecipeRef(params), stripItemID(setRecipeDefaults(r)))
    .key;
}

export async function deleteRecipe(params: RecipeRefParams) {
  return await remove(getRecipeRef(params));
}

export async function batchUpdateRecipes(
  params: RecipeRefParams,
  updates: Record<string, Recipe | null>
) {
  return await update(getRecipeRef(params), updates);
}
