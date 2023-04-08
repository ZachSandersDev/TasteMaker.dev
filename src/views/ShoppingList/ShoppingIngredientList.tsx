import { Reorder } from "framer-motion";
import { useState } from "react";

import { Ingredient } from "../../@modules/types/recipes";
import {
  ShoppingList,
  ShoppingListIngredient,
} from "../../@modules/types/shoppingLists";

import IngredientItem from "../../components/IngredientItem";

import "./ShoppingIngredientList.scss";

export interface ShoppingIngredientListProps {
  list: ShoppingList;
  onNew: () => void;
  onUpdate: (ingredient: Ingredient, index: number) => void;
  onDelete: (index: number) => void;
  onReorder: (ingredients: Ingredient[]) => void;
}

export function ShoppingIngredientList({
  list,
  onNew,
  onUpdate,
  onDelete,
  onReorder,
}: ShoppingIngredientListProps) {
  const [isEditing, setIsEditing] = useState(false);

  const setComplete = (
    ingredient: ShoppingListIngredient,
    index: number,
    complete?: boolean
  ) => {
    const newIngredient = structuredClone(ingredient);
    newIngredient.complete = complete;
    onUpdate(newIngredient, index);
  };

  return (
    <>
      <header className="ra-header">
        <h3>List</h3>
        <div className="ra-actions">
          <button
            className="chip-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            <i className="material-symbols-rounded">
              {isEditing ? "save" : "edit"}
            </i>
            {isEditing ? "Save List" : "Edit list"}
          </button>
          <button className="chip-button" onClick={onNew}>
            <i className="material-symbols-rounded">add</i>
            New Item
          </button>
        </div>
      </header>

      {isEditing ? (
        <Reorder.Group
          className="ra-list"
          axis="y"
          as="div"
          values={list.ingredients}
          onReorder={onReorder}
        >
          {list.ingredients.map((ingredient, i) => (
            <IngredientItem
              ingredient={ingredient}
              key={ingredient._id}
              updateIngredient={(n) => onUpdate(n, i)}
              deleteIngredient={() => onDelete(i)}
            />
          ))}
        </Reorder.Group>
      ) : (
        <div className="ra-list">
          {list.ingredients.map((ingredient, i) => (
            <div
              className="sil-ingredient-line"
              key={ingredient._id}
              style={{
                opacity: ingredient.complete ? ".4" : "1",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={!!ingredient.complete}
                  onChange={(e) => setComplete(ingredient, i, e.target.checked)}
                />
                <span
                  className={[
                    "sil-checkbox material-symbols-rounded",
                    ingredient.complete ? "sil-checkbox-checked" : "",
                  ]
                    .filter((c) => !!c)
                    .join(" ")}
                >
                  {ingredient.complete ? "check" : ""}
                </span>
                {ingredient.complete && <div className="sil-strikethrough" />}
                {ingredient.value &&
                  parseFloat(ingredient.value).toString()}{" "}
                {ingredient.units} {ingredient.ingredient}
              </label>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
