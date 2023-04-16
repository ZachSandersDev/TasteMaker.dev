import { parseIngredient, unitsOfMeasure } from "parse-ingredient";
import { v4 as uuid } from "uuid";

import { Ingredient, Recipe, Step } from "../types/recipes";

export default function parseRecipe(recipe: Recipe, ingredientText: string, stepText: string) {
  const newRecipe = structuredClone(recipe);
  newRecipe.ingredients = parseIngredients(ingredientText);
  newRecipe.steps = parseSteps(stepText);
  return newRecipe;
}

function getShortUnit(unitOfMeasureID: string | null) {
  const shortUOM = unitsOfMeasure?.[unitOfMeasureID || ""]?.short;

  if (shortUOM === "c") return "cups";
  return shortUOM;
}

function parseIngredients(iText: string): Ingredient[] {
  const iLines = iText
    .trim()
    .replace(/\r/g, "")
    .split("\n")
    .map(line => line.trim().replace(/^(-|\d+\.\s*|\d+\)\s*|\d+\s+(?=\d)|\.|\*)/g, ""));

  const rawIngredients = parseIngredient(iLines.join("\n"));

  return rawIngredients
    .map(
      ({ quantity, unitOfMeasure, description, unitOfMeasureID }) => {
        if (description) {
          return {
            _id: uuid(),
            value: String(quantity || ""),
            units: getShortUnit(unitOfMeasureID) || unitOfMeasure || "",
            ingredient: description.replace(/\*+/g, "")
          };
        }
        return null;
      }
    )
    .filter((i): i is Ingredient => !!i);
}

function parseSteps(stepText: string): Step[] {
  const stepLines = stepText
    .trim()
    .replace(/\r/g, "")
    .split("\n")
    .map(line => line.trim().replace(/^(-|\d+\.?\)?|\.|\*)\s*/g, ""));

  return stepLines.map(text => ({ _id: uuid(), text }));
}