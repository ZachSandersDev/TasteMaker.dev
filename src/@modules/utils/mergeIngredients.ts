import { Ingredient, parseIngredient } from "parse-ingredient";

import { Recipe } from "../types/recipes";
import { ShoppingList } from "../types/shoppingLists";

export default function mergeIngredients(recipe: Recipe, list: ShoppingList) {
  const rawRecipeIngredients = recipe.ingredients.reduce((a, li) => {
    a[li._id] = parseIngredient(li.ingredient)[0];
    return a;
  }, {} as Record<string, Ingredient>);

  const rawListIngredients = list.ingredients.reduce((a, li) => {
    a[li._id] = parseIngredient(li.ingredient)[0];
    return a;
  }, {} as Record<string, Ingredient>);

  for (const recipeId in rawRecipeIngredients) {
    const riRaw = rawRecipeIngredients[recipeId];
    const listId = Object.keys(rawListIngredients).find(
      (liKey) => {
        const li = rawListIngredients[liKey];
        if(li.description === riRaw.description && 
        li.unitOfMeasureID === riRaw.unitOfMeasureID) {
          return liKey;
        } 
      }
    );

    const listIngredient = list.ingredients.find(li => li._id === listId);
    if (listIngredient && listId) {
      const liRaw = rawListIngredients[listId];
      listIngredient.value = (
        Number(liRaw.quantity) + Number(riRaw.quantity)
      ).toString();
    } else {
      const recipeIngredient = recipe.ingredients.find(li => li._id === recipeId);
      if(recipeIngredient) {
        const ingredient = structuredClone(recipeIngredient);
        ingredient.ingredient = ingredient.value + " " + ingredient.ingredient;
        list.ingredients.push(ingredient);
      }
    }
  }
}
