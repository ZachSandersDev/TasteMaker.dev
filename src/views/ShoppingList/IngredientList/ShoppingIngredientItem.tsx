import { Reorder, useDragControls } from "framer-motion";

import { KeyboardEvent, forwardRef } from "react";

import ContentEditable from "../../../@design/components/ContentEditable/ContentEditable";
import { ShoppingListIngredient } from "../../../@modules/types/shoppingLists";

import classNames from "../../../@modules/utils/classNames";
import SwipeToDelete from "../../../components/SwipeToDelete";

import { ShoppingIngredientListProps } from "../IngredientList/ShoppingIngredientList";

export interface ShoppingIngredientItemProp
  extends ShoppingIngredientListProps {
  ingredient: ShoppingListIngredient;
  index: number;
  onKeyDown?: (e: KeyboardEvent) => void;
}

export const ShoppingIngredientItem = forwardRef<
  HTMLDivElement,
  ShoppingIngredientItemProp
>(({ ingredient, index, onDelete, onUpdate, onKeyDown, editing }, ref) => {
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
      className={classNames("sil-ingredient-item", editing && "editing")}
      value={ingredient}
      dragListener={false}
      dragControls={controls}
    >
      <SwipeToDelete editing={editing} onDelete={() => onDelete(index)}>
        <div
          className="sil-ingredient-line"
          style={{
            opacity: ingredient.complete ? ".4" : "1",
          }}
        >
          {editing && (
            <div
              onPointerDown={(e) => controls.start(e)}
              style={{ touchAction: "none" }}
              className="material-symbols-rounded drag-handle"
            >
              drag_indicator
            </div>
          )}

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

          {ingredient.complete && !editing && (
            <div className="sil-strikethrough" />
          )}

          {editing ? (
            <ContentEditable
              className="sil-item-text"
              value={ingredient.ingredient}
              placeholder="Shopping item"
              onChange={(v) => {
                const newIngredient = structuredClone(ingredient);
                newIngredient.ingredient = v;
                onUpdate(newIngredient, index);
              }}
              onKeyDown={onKeyDown}
              ref={ref}
              naked
            />
          ) : (
            <span className="sil-item-text">{ingredient.ingredient}</span>
          )}
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
});

ShoppingIngredientItem.displayName = "ShoppingIngredientItem";
export default ShoppingIngredientItem;
