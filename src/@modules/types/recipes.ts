import { v4 as uuid } from "uuid";

import { RecipeRefParams } from "../api/recipes";

import { ImageField } from "./imageField";

export interface Recipe {
  _id: string;
  name: string;
  icon?: string | null;
  parent?: string | null;

  servingSize?: string;
  prepTime?: string;

  ingredients: Ingredient[];
  steps: Step[];

  bannerImage?: ImageField | null;
  iconImage?: ImageField | null;
  public?: true | null;
}

export interface Ingredient {
  value: string;
  units: string;
  ingredient: string;
  _id: string;
  subHeading?: boolean;
  fromRecipes?: RecipeRefParams[];
  complete?: boolean;
}

export interface Step {
  _id: string;
  text: string;
}

export function setRecipeDefaults(recipie: Partial<Recipe>) {
  const defaultedRecipe: Recipe = {
    _id: recipie._id || "",
    name: recipie.name || "",
    icon: recipie.icon || null,
    parent: recipie.parent || null,

    servingSize: recipie.servingSize || "",
    prepTime: recipie.prepTime || "",

    steps: recipie.steps || [],
    ingredients: recipie.ingredients || [],

    bannerImage: recipie.bannerImage || null,
    iconImage: recipie.iconImage || null,
    public: recipie.public || null,
  };

  return defaultedRecipe;
}

export function getBlankIngredient(): Ingredient {
  return {
    value: "",
    units: "",
    ingredient: "",
    _id: uuid(),
    subHeading: false,
  };
}

export function getBlankStep(): Step {
  return {
    _id: uuid(),
    text: "",
  };
}
