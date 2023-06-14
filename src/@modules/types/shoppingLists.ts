import { RecipeRefParams } from "../api/recipes";

export interface ShoppingList {
  _id: string;
  name: string;
  ingredients: ShoppingListIngredient[];
}

export interface ShoppingListIngredient {
  _id: string;
  ingredient: string;
  fromRecipes?: RecipeRefParams[];
  complete?: boolean;
}

export function setListDefaults(list: Partial<ShoppingList>) {
  const defaultedShoppingList: ShoppingList = {
    _id: list._id || "",
    name: list.name || "",
    ingredients: list.ingredients || [],
  };

  return defaultedShoppingList;
}
