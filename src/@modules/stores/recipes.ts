import { atom, useRecoilValue } from "recoil";

import { setRecoil } from "recoil-nexus";

import { getRecipesLive } from "../api/recipes";
import { Recipe } from "../types/recipes";

export const recipeStore = atom<{ listener: () => void, loading: boolean, recipes: Recipe[] }>({
  key: "recipeStore",
  default: { listener: () => undefined, loading: false, recipes: [] }
});

export function listenForRecipes() {
  const listener = getRecipesLive((recipes) => {
    setRecoil(recipeStore, (state) => ({ ...state, recipes, loading: false }));
  });

  setRecoil(recipeStore, (state) => ({ ...state, loading: true, listener }));
}

export function useRecipe(recipeId: string) {
  const { recipes } = useRecoilValue(recipeStore);
  return structuredClone(recipes.find(r => r._id === recipeId));
}