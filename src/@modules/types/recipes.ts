export interface Recipe {
  _id: string;
  name: string;
  icon: string;
  parent?: string | null;

  servingSize?: string
  prepTime?: string

  ingredients: Ingredient[];
  steps: Step[];

  bannerImage?: ImageField | null;
  iconImage?: ImageField | null;
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

export interface ImageField {
  imageId: string;
  imageUrl: string;
}

export function setRecipeDefaults(recipie: Partial<Recipe>) {
  const defaultedRecipe: Recipe = {
    _id: recipie._id || "",
    name: recipie.name || "",
    icon: recipie.icon || "",
    parent: recipie.parent || null,

    servingSize: recipie.servingSize || "",
    prepTime: recipie.prepTime || "",

    steps: recipie.steps || [],
    ingredients: recipie.ingredients || [],

    bannerImage: recipie.bannerImage || null,
    iconImage: recipie.iconImage || null
  };

  return defaultedRecipe;
}