import { atom } from "recoil";

import { Recipe } from "../types/recipes";

export interface DialogState<T, P> {
  resolve?: (r?: T) => void;
  reject?: (e: Error) => void;
  payload?: P
}

export const RecipeSelectorDialogAtom = atom<DialogState<Recipe | string, { folderOnly?: boolean; disablePathUnder?: string }>>({
  key: "recipeSelectorDialog",
  default: {},
});

export const EditIngredientDialog = atom<DialogState<string, string>>({
  key: "editIngredientDialog",
  default: {},
});

export const TextInputDialog = atom<DialogState<string, { title: string, placeholder: string, value?: string }>>({
  key: "textInputDialog",
  default: {},
});
