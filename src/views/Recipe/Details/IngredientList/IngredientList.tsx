import { Reorder } from "framer-motion";

import { Ingredient, Recipe } from "../../../../@modules/types/recipes";

import IngredientItem from "./IngredientItem";

export interface IngredientListProps {
  ingredients: Ingredient[];
  editing: boolean;
  updateRecipe: (updateFunc: (r: Recipe) => void) => void;
}

export default function IngredientList({
  ingredients,
  editing,
  updateRecipe,
}: IngredientListProps) {
  const reorderIngredients = (ingredients: Ingredient[]) => {
    updateRecipe((r) => (r.ingredients = ingredients));
  };

  const updateIngredient = (newIngredient: Ingredient, index: number) => {
    updateRecipe((r) => r.ingredients.splice(index, 1, newIngredient));
  };

  const deleteIngredient = (index: number) => {
    updateRecipe((r) => r.ingredients.splice(index, 1));
  };

  if (!editing) {
    return (
      <div className="ingredient-list">
        {ingredients.map((ingredient, i) => (
          <IngredientItem
            ingredient={ingredient}
            key={ingredient._id}
            updateIngredient={(ni) => updateIngredient(ni, i)}
            deleteIngredient={() => deleteIngredient(i)}
            editing={editing}
          />
        ))}
      </div>
    );
  }

  return (
    <Reorder.Group
      // className="ra-list"
      className="ingredient-list"
      axis="y"
      as="table"
      values={ingredients}
      onReorder={reorderIngredients}
    >
      {ingredients.map((ingredient, i) => (
        <IngredientItem
          ingredient={ingredient}
          key={ingredient._id}
          updateIngredient={(ni) => updateIngredient(ni, i)}
          deleteIngredient={() => deleteIngredient(i)}
          editing={editing}
        />
      ))}
    </Reorder.Group>
  );
}
