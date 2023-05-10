import { atom, useRecoilState } from "recoil";

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

export function useRecipe(recipeId: string): [Recipe | undefined, (newRecipe: Recipe) => void] {
  const [state, setState] = useRecoilState(recipeStore);
  const { recipes } = state;

  if (!recipeId) {
    return [undefined, () => undefined];
  }

  const updateRecipe = (newRecipe: Recipe) => {
    const recipeIndex = recipes.findIndex(r => r._id === newRecipe._id);
    if (recipeIndex === -1) throw "Recipe not found";

    const newState = { ...state, recipes: [...state.recipes] };
    newState.recipes[recipeIndex] = newRecipe;
    setState(newState);
  };

  const recipe = recipes.find(r => r._id === recipeId);
  return [recipe ? structuredClone(recipe) : undefined, updateRecipe];
}