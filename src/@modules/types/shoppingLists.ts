import { Ingredient } from "./recipes";

export interface ShoppingList {
  _id: string;
  name: string;
  recipeIds: string[],
  ingredients: ShoppingListIngredient[];
}

export interface ShoppingListIngredient extends Ingredient {
  complete?: boolean
}

export function setListDefaults(list: Partial<ShoppingList>) {
  const defaultedShoppingList: ShoppingList = {
    _id: list._id || "",
    name: list.name || "",
    recipeIds: list.recipeIds || [],
    ingredients: list.ingredients || [],
  }

  return defaultedShoppingList
}