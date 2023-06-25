import { Ingredient as RawIngredient, parseIngredient } from "parse-ingredient";
import { v4 as uuid } from "uuid";

import { RecipeRefParams } from "../api/recipes";
import { getShortUnit } from "../parsers/textParser";
import { Ingredient, Recipe } from "../types/recipes";
import { ShoppingList } from "../types/shoppingLists";

interface ParsedIngredientItem<T> {
  raw: RawIngredient;
  original: T;
}

function parseIngredients(
  ingredients: Ingredient[]
): ParsedIngredientItem<Ingredient>[] {
  return ingredients
    .filter((i) => !i.subHeading)
    .map((li) => ({
      raw: parseIngredient(li.value + " " + li.ingredient)[0],
      original: li,
    }));
}

function parseShoppingIngredients(
  ingredients: Ingredient[]
): ParsedIngredientItem<Ingredient>[] {
  return ingredients
    .map((li) => ({ raw: parseIngredient(li.ingredient)[0], original: li }))
    .filter(({ raw }) => !!raw);
}

export default function mergeIngredients(
  recipeParams: RecipeRefParams,
  recipe: Recipe,
  list: ShoppingList
) {
  const recipeIngredients = parseIngredients(recipe.ingredients);
  const listIngredients = parseShoppingIngredients(list.ingredients);

  for (const { raw: rawRecipeI, original: recipeI } of recipeIngredients) {
    // Find a matching list ingredient
    const { raw: rawListI, original: listI } =
      listIngredients.find(
        ({ raw: rawListI }) =>
          rawListI.description === rawRecipeI.description &&
          rawListI.unitOfMeasureID === rawRecipeI.unitOfMeasureID
      ) || {};

    // If we already have that ingredient, just add the quantity to it
    if (rawListI && listI) {
      listI.ingredient = `${
        Number(rawListI.quantity || 0) + Number(rawRecipeI.quantity || 0)
      } ${getShortUnit(rawListI.unitOfMeasureID)} ${recipeI.ingredient}`;

      // Add this recipe to the ingredient entry
      if (!listI.fromRecipes) listI.fromRecipes = [];
      listI.fromRecipes.push(recipeParams);
    }

    // Otherwise, add the recipe ingredient to the end of the list
    else {
      const newIngredient: Ingredient = {
        _id: uuid(),
        value: recipeI.value + " " + recipeI.ingredient,
        units: "",
        ingredient: "",
      };

      // Add this recipe to the ingredient entry
      if (!newIngredient.fromRecipes) newIngredient.fromRecipes = [];
      newIngredient.fromRecipes.push(recipeParams);

      list.ingredients.push(newIngredient);
    }
  }
}
