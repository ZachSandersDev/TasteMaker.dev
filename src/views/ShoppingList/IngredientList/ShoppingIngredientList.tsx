import { useEffect } from "react";

import {
  ShoppingList,
  ShoppingListIngredient,
  getBlankShoppingListIngredient,
} from "../../../@modules/types/shoppingLists";

import { KeyboardList } from "../../../components/KeyboardList";

import ShoppingIngredientItem from "./ShoppingIngredientItem";

import "./ShoppingIngredientList.scss";

export interface ShoppingIngredientListProps {
  ingredients: ShoppingListIngredient[];
  editing?: boolean;
  updateShoppingList?: (updateFunc: (r: ShoppingList) => void) => void;
}

export function ShoppingIngredientList({
  ingredients,
  editing,
  updateShoppingList,
}: ShoppingIngredientListProps) {
  useEffect(() => {
    if (!ingredients.length) {
      updateShoppingList?.(
        (r) => (r.ingredients = [getBlankShoppingListIngredient()])
      );
    }
  }, [ingredients]);

  const reorderIngredients = (ingredients: ShoppingListIngredient[]) => {
    updateShoppingList?.((r) => (r.ingredients = ingredients));
  };

  const updateIngredient = (
    newIngredient: ShoppingListIngredient,
    index: number
  ) => {
    updateShoppingList?.((r) => r.ingredients.splice(index, 1, newIngredient));
  };

  const deleteIngredient = (index: number) => {
    updateShoppingList?.((r) => {
      if (r.ingredients.length === 1) {
        r.ingredients = [
          { ...getBlankShoppingListIngredient(), _id: r.ingredients[0]._id },
        ];
        return;
      }

      r.ingredients.splice(index, 1);
    });
  };

  const newIngredient = (at?: number) => {
    updateShoppingList?.((r) =>
      r.ingredients.splice(
        at || r.ingredients.length,
        0,
        getBlankShoppingListIngredient()
      )
    );
  };

  return (
    <KeyboardList<ShoppingListIngredient>
      values={ingredients}
      onReorder={reorderIngredients}
      onNew={newIngredient}
      onDelete={deleteIngredient}
      renderItem={(ingredient, i, onKeyDown, ref) => (
        <ShoppingIngredientItem
          key={ingredient._id}
          ingredient={ingredient}
          editing={editing}
          onUpdate={(newIngredient) => updateIngredient(newIngredient, i)}
          onDelete={() => deleteIngredient(i)}
          onKeyDown={onKeyDown}
          ref={ref}
        />
      )}
    />
  );
}
