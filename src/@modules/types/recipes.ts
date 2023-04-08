export interface Recipe {
  _id: string;
  name: string;
  icon: string;

  servingSize?: string
  prepTime?: string

  ingredients: Ingredient[];
  steps: Step[];
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
    _id: recipie._id || "",
    name: recipie.name || "",
    icon: recipie.icon || "",

    servingSize: recipie.servingSize || "",
    prepTime: recipie.prepTime || "",

    steps: recipie.steps || [],
    ingredients: recipie.ingredients || [],
  };

  return defaultedRecipe;
}