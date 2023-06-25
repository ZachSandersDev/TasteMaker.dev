import { Ingredient as RawIngredient, parseIngredient } from "parse-ingredient";
import { v4 as uuid } from "uuid";

import { RecipeRefParams } from "../api/recipes";
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
      raw: parseIngredient(
        [li.value, li.units, li.ingredient].filter(Boolean).join(" ")
      )[0],
      original: li,
    }))
    .filter(({ raw }) => !!raw);
}

export default function mergeIngredients(
  recipeParams: RecipeRefParams,
  recipe: Recipe,
  list: ShoppingList
) {
  const recipeIngredients = parseIngredients(recipe.ingredients);
  const listIngredients = parseIngredients(list.ingredients);

  // Empty the list of the default blank line if it's the only ingredient
  if (list.ingredients.length === 1 && list.ingredients[0].value === "") {
    list.ingredients = [];
  }

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
      listI.value = [
        Number(rawListI.quantity || 0) + Number(rawRecipeI.quantity || 0),
        rawListI.unitOfMeasure,
        rawListI.description,
      ]
        .filter(Boolean)
        .join(" ");

      // Add this recipe to the ingredient entry
      if (!listI.fromRecipes) listI.fromRecipes = [];
      if (
        !listI.fromRecipes.find((r) => r.recipeId === recipeParams.recipeId)
      ) {
        listI.fromRecipes.push(recipeParams);
      }
    }

    // Otherwise, add the recipe ingredient to the end of the list
    else {
      const newIngredient: Ingredient = {
        _id: uuid(),
        value: [recipeI.value, recipeI.units, recipeI.ingredient]
          .filter(Boolean)
          .join(" "),
        units: "",
        ingredient: "",
      };

      // Add this recipe to the ingredient entry
      if (!newIngredient.fromRecipes) newIngredient.fromRecipes = [];
      if (
        !newIngredient.fromRecipes.find(
          (r) => r.recipeId === recipeParams.recipeId
        )
      ) {
        newIngredient.fromRecipes.push(recipeParams);
      }

      list.ingredients.push(newIngredient);
    }
  }
}
