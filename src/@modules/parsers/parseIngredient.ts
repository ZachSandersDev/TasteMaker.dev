import { parseIngredient as parseIngredientParts } from "parse-ingredient";

import { Ingredient } from "../types/recipes";

export function parseIngredient(ingredient: Ingredient): string {
  const [ingredientParts] = parseIngredientParts(
    [ingredient.value, ingredient.units, ingredient.ingredient]
      .filter(Boolean)
      .join(" ")
  );

  return ingredientParts?.description ?? "";
}
