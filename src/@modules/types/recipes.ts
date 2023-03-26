export interface Recipe {
  name: string;
  ingredients: Ingredient[];
  steps: Step[];
  _id: string;

  servingSize?: string
  prepTime?: string
}

export interface Ingredient {
  value: string;
  units: string;
  ingredient: string;
  _id: string;
}

export interface Step {
  _id: string;
  text: string;
}

export function setRecipeDefaults(recipie: Partial<Recipe>) {
  const defaultedRecipe: Recipe = {
    name: recipie.name || "",
    _id: recipie._id || "",
    steps: recipie.steps || [],
    ingredients: recipie.ingredients || [],
  }

  return defaultedRecipe
}