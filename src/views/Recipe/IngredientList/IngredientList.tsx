import { useEffect } from "react";

import {
  Ingredient,
  getBlankIngredient,
} from "../../../@modules/types/recipes";

import { KeyboardList } from "../../../components/KeyboardList";

import { IngredientItem } from "./IngredientItem";

import "./IngredientList.scss";

export interface IngredientListProps {
  ingredients: Ingredient[];
  editing: boolean;
  checklist?: boolean;
  updateRecipe?: (
    updateFunc: (r: { ingredients: Ingredient[] }) => void
  ) => void;
}

export default function IngredientList({
  ingredients,
  editing,
  checklist = false,
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
      className="ingredient-list"
      values={ingredients}
      onReorder={reorderIngredients}
      onNew={newIngredient}
      onDelete={deleteIngredient}
      renderItem={(ingredient, i, onKeyDown, ref) => (
        <IngredientItem
          key={ingredient._id}
          ingredient={ingredient}
          editing={editing}
          checklist={checklist}
          onUpdate={(ni) => updateIngredient(ni, i)}
          onDelete={() => deleteIngredient(i)}
          onKeyDown={onKeyDown}
          ref={ref}
        />
      )}
    />
  );
}
