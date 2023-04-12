
import { Ingredient } from "../../@modules/types/recipes";
import {
  ShoppingList,
  ShoppingListIngredient,
} from "../../@modules/types/shoppingLists";
import ContentEditable from "../../components/ContentEditable";
import SwipeToDelete from "../../components/SwipeToDelete";


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
}: ShoppingIngredientListProps) {
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
          <button className="chip-button" onClick={onNew}>
            <i className="material-symbols-rounded">add</i>
            New Item
          </button>
        </div>
      </header>
     
      <div className="ra-list">
        {list.ingredients.map((ingredient, i) => (
          <SwipeToDelete key={ingredient._id} onDelete={() => onDelete(i)}>
            <div
              className="sil-ingredient-line"
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
              </label>

              {ingredient.complete && <div className="sil-strikethrough" />}
              <ContentEditable
                value={ingredient.ingredient}
                onChange={(v) => {
                  const newIngredient = structuredClone(ingredient);
                  newIngredient.ingredient = v;
                  onUpdate(newIngredient, i);
                }}
                disabled={ingredient.complete}
                naked
              />
            </div>
          </SwipeToDelete>
        ))}
      </div>
    </>
  );
}
