import { atom } from "recoil";

import { setRecoil } from "recoil-nexus";
import { getIngredientsLive } from "../api/ingredients";

export const ingredientStore = atom<{
  listener: () => void, loading: boolean, ingredients: string[]
}>({
  key: 'ingredientStore',
  default: { listener: () => undefined, loading: false, ingredients: [] }
});

export function listenForIngredients() {
  const listener = getIngredientsLive((ingredients) => {
    setRecoil(ingredientStore, (state) => ({ ...state, ingredients: Object.keys(ingredients), loading: false }))
  })

  setRecoil(ingredientStore, (state) => ({ ...state, loading: true, listener }))
}