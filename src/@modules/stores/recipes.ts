import { useRecoilState } from "recoil";

import { setRecoil } from "recoil-nexus";

import { getRecipesLive } from "../api/recipes";
import { Recipe } from "../types/recipes";
import persistentAtom from "../utils/persistentAtom";

const RECIPE_PERSIST_KEY = "tm-recipe-store";

export const recipeStore = persistentAtom<{ loading: boolean, recipes: Recipe[] }>({
  key: "recipeStore",
  default: { loading: false, recipes: [] }
}, RECIPE_PERSIST_KEY, "recipes");

export function listenForRecipes() {
  if (!localStorage.getItem(RECIPE_PERSIST_KEY)) {
    setRecoil(recipeStore, (state) => ({ ...state, loading: true }));
  }

  const listener = getRecipesLive((recipes) => {
    setRecoil(recipeStore, (state) => ({ ...state, recipes, loading: false }));
  });

  return () => {
    listener();
    setRecoil(recipeStore, () => ({ recipes: [], loading: false }));
  };
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