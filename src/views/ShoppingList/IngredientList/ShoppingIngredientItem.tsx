import { Reorder, useDragControls } from "framer-motion";

import { ShoppingListIngredient } from "../../../@modules/types/shoppingLists";
import ContentEditable from "../../../components/ContentEditable";

import SwipeToDelete from "../../../components/SwipeToDelete";

import { ShoppingIngredientListProps } from "../IngredientList/ShoppingIngredientList";

export interface ShoppingIngredientItemProp
  extends ShoppingIngredientListProps {
  ingredient: ShoppingListIngredient;
  index: number;
}

export default function ShoppingIngredientItem({
  ingredient,
  index,
  onDelete,
  onUpdate,
  onNew,
}: ShoppingIngredientItemProp) {
  const controls = useDragControls();

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
    <Reorder.Item
      className="sil-ingredient-item"
      value={ingredient}
      dragListener={false}
      dragControls={controls}
    >
      <SwipeToDelete onDelete={() => onDelete(index)}>
        <div
          className="sil-ingredient-line"
          style={{
            opacity: ingredient.complete ? ".4" : "1",
          }}
        >
          <div
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </div>

          <label>
            <input
              type="checkbox"
              checked={!!ingredient.complete}
              onChange={(e) => setComplete(ingredient, index, e.target.checked)}
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
            className="sil-item-text"
            value={ingredient.ingredient}
            placeholder="Shopping item"
            onChange={(v) => {
              const newIngredient = structuredClone(ingredient);
              newIngredient.ingredient = v;
              onUpdate(newIngredient, index);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onNew(index + 1);
              }
            }}
            disabled={ingredient.complete}
            naked
          />
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
