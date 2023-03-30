import { Ingredient } from "./recipes";

export interface ShoppingList {
  _id: string;
  name: string;
  ingredients: Ingredient[];
}


export function setListDefaults(recipie: Partial<ShoppingList>) {
  const defaultedShoppingList: ShoppingList = {
    _id: recipie._id || "",
    name: recipie.name || "",
    ingredients: recipie.ingredients || [],
  }

  return defaultedShoppingList
}