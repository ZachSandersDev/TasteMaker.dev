import { atom, selector, useRecoilValue } from "recoil";

import { setRecoil } from "recoil-nexus";
import { Recipe } from "../types/recipes";
import { getRecipesLive } from "../api/recipes";

export const recipeStore = atom<{ listener: () => void, recipes: Recipe[] }>({
  key: 'recipeStore',
  default: { listener: () => undefined, recipes: [] }
});

export function listenForRecipes() {
  const listener = getRecipesLive((recipes) => {
    setRecoil(recipeStore, (state) => ({ ...state, recipes }))
  })

  setRecoil(recipeStore, (state) => ({ ...state, listener }))
}

export function useRecipe(recipeId: string) {
  const { recipes } = useRecoilValue(recipeStore);
  return structuredClone(recipes.find(r => r._id === recipeId))
}