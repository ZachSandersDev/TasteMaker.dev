
import { setRecoil } from "recoil-nexus";

import { getIngredientsLive } from "../api/ingredients";
import persistentAtom from "../utils/persistentAtom";

const INGREDIENT_PERSIST_KEY = "tm-ingredient-store";

export const ingredientStore = persistentAtom<{
  loading: boolean, ingredients: string[]
}>({
  key: "ingredientStore",
  default: { loading: false, ingredients: [] }
}, INGREDIENT_PERSIST_KEY, "ingredients");

export function listenForIngredients() {
  getIngredientsLive((ingredients) => {
    setRecoil(ingredientStore, (state) => ({ ...state, ingredients: Object.keys(ingredients).sort(), loading: false }));
  });

  if (!localStorage.getItem(INGREDIENT_PERSIST_KEY)) {
    setRecoil(ingredientStore, (state) => ({ ...state, loading: true }));
  }
}