import { v4 as uuid } from "uuid";

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
    ingredients:
      list.ingredients?.map((i) => ({
        _id: i._id || uuid(),
        ingredient: i.ingredient || "",
        fromRecipes:
          i.fromRecipes?.map((fr) => ({
            userId: fr.userId || "",
            workspaceId: fr.workspaceId || "",
            recipeId: fr.recipeId || "",
          })) || [],
        complete: i.complete || false,
      })) || [],
  };

  return defaultedShoppingList;
}

export function getBlankShoppingListIngredient() {
  return {
    _id: uuid(),
    ingredient: "",
    fromRecipes: [],
    complete: false,
  };
}
