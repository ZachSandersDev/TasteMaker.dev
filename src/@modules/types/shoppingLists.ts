import { v4 as uuid } from "uuid";

import { Ingredient } from "./recipes";

export interface ShoppingList {
  _id: string;
  name: string;
  ingredients: Ingredient[];
}

export function setListDefaults(list: Partial<ShoppingList>) {
  const defaultedShoppingList: ShoppingList = {
    _id: list._id || "",
    name: list.name || "",
    ingredients:
      list.ingredients?.map((i) => ({
        _id: i._id || uuid(),
        ingredient: i.ingredient || "",
        value: i.value || "",
        units: i.units || "",
        subHeading: i.subHeading || false,
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
