import { Recipe } from "../types/recipes";
import { ShoppingList } from "../types/shoppingLists";

export default function mergeIngredients(recipe: Recipe, list: ShoppingList) {
  for (const recipeIngredient of recipe.ingredients) {
    let listIngredient = list.ingredients.find(
      (li) =>
        li.ingredient === recipeIngredient.ingredient &&
        li.units === recipeIngredient.units
    );

    if (listIngredient) {
      listIngredient.value = (
        Number(listIngredient.value) + Number(recipeIngredient.value)
      ).toString();
    } else {
      listIngredient = recipeIngredient;
      list.ingredients.push(listIngredient);
    }
  }
}
