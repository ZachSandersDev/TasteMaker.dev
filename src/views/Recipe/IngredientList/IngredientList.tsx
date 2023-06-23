import { useEffect } from "react";

import {
  Ingredient,
  Recipe,
  getBlankIngredient,
} from "../../../@modules/types/recipes";

import classNames from "../../../@modules/utils/classNames";
import { KeyboardList } from "../../../components/KeyboardList";

import { IngredientItem } from "./IngredientItem";

import "./IngredientList.scss";

export interface IngredientListProps {
  ingredients: Ingredient[];
  editing: boolean;
  updateRecipe?: (updateFunc: (r: Recipe) => void) => void;
}

export default function IngredientList({
  ingredients,
  editing,
  updateRecipe,
}: IngredientListProps) {
  useEffect(() => {
    if (!ingredients.length) {
      updateRecipe?.((r) => (r.ingredients = [getBlankIngredient()]));
    }
  }, [ingredients]);

  const reorderIngredients = (ingredients: Ingredient[]) => {
    updateRecipe?.((r) => (r.ingredients = ingredients));
  };

  const updateIngredient = (newIngredient: Ingredient, index: number) => {
    updateRecipe?.((r) => r.ingredients.splice(index, 1, newIngredient));
  };

  const deleteIngredient = (index: number) => {
    updateRecipe?.((r) => {
      if (r.ingredients.length === 1) {
        r.ingredients = [
          { ...getBlankIngredient(), _id: r.ingredients[0]._id },
        ];
        return;
      }

      r.ingredients.splice(index, 1);
    });
  };

  const newIngredient = (at?: number) => {
    updateRecipe?.((r) =>
      r.ingredients.splice(at || r.ingredients.length, 0, getBlankIngredient())
    );
  };

  return (
    <KeyboardList<Ingredient>
      className={classNames(!editing && "ingredient-list")}
      values={ingredients}
      onReorder={reorderIngredients}
      onNew={newIngredient}
      onDelete={deleteIngredient}
      renderItem={(ingredient, i, onKeyDown, ref) => (
        <IngredientItem
          ingredient={ingredient}
          key={ingredient._id}
          updateIngredient={(ni) => updateIngredient(ni, i)}
          deleteIngredient={() => deleteIngredient(i)}
          editing={editing}
          onKeyDown={onKeyDown}
          ref={ref}
        />
      )}
    />
  );
}
