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
  header?: boolean;
  updateRecipe?: (
    updateFunc: (r: { ingredients: Ingredient[] }) => void
  ) => void;
}

export default function IngredientList({
  ingredients,
  editing,
  checklist = false,
  header = false,
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

  const newIngredient = (at?: number, values?: string[]) => {
    updateRecipe?.((r) => {
      const hasValue = !!at && !!r.ingredients[at]?.value;

      r.ingredients.splice(
        at ?? r.ingredients.length,
        !hasValue ? 1 : 0,
        ...(values
          ? values.map((v) => getBlankIngredient(v))
          : [getBlankIngredient()])
      );
    });
  };

  if (!editing && !ingredients.some(({ value }) => !!value)) {
    return null;
  }

  return (
    <div>
      {header && (
        <header className="ra-header">
          <h3>Ingredients</h3>
        </header>
      )}
      <KeyboardList<Ingredient>
        className="ingredient-list"
        values={ingredients}
        onReorder={reorderIngredients}
        onNew={newIngredient}
        onDelete={deleteIngredient}
        renderItem={(ingredient, i, { onKeyDown, onPaste }, ref) => (
          <IngredientItem
            key={ingredient._id}
            ingredient={ingredient}
            editing={editing}
            checklist={checklist}
            onUpdate={(ni) => updateIngredient(ni, i)}
            onDelete={() => deleteIngredient(i)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            ref={ref}
          />
        )}
      />
    </div>
  );
}
