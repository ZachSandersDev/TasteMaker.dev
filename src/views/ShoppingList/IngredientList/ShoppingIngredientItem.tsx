import { Reorder, useDragControls } from "framer-motion";
import { KeyboardEvent, forwardRef } from "react";
import { useRecoilValue } from "recoil";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { recipeStore } from "../../../@modules/stores/recipes";
import { Recipe } from "../../../@modules/types/recipes";
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
  HTMLTextAreaElement,
  ShoppingIngredientItemProp
>(({ ingredient, index, onDelete, onUpdate, onKeyDown, editing }, ref) => {
  const { recipes } = useRecoilValue(recipeStore);
  const includedInRecipes =
    ingredient.recipeIds
      ?.map((id) => recipes.find((r) => r._id === id))
      .filter((r): r is Recipe => !!r) || [];

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

  if (!editing) {
    return (
      <div className="sil-ingredient-item">
        <div className="sil-wrapper">
          <div
            className="sil-ingredient-line"
            style={{
              opacity: ingredient.complete ? ".2" : "1",
            }}
          >
            <label>
              <input
                type="checkbox"
                checked={!!ingredient.complete}
                onChange={(e) =>
                  setComplete(ingredient, index, e.target.checked)
                }
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
              <span className="sil-item-text">{ingredient.ingredient}</span>
            </label>
          </div>
          {!!includedInRecipes.length && (
            <span className="sil-included-in">
              {includedInRecipes.map((r, i) => (
                <span key={r._id}>
                  {r.name}
                  {i !== includedInRecipes.length - 1 && ", "}
                </span>
              ))}
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Reorder.Item
      className={classNames("sil-ingredient-item", editing && "editing")}
      value={ingredient}
      dragListener={false}
      dragControls={controls}
    >
      <SwipeToDelete editing={editing} onDelete={() => onDelete(index)}>
        <div className="sil-wrapper">
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

            {!editing && (
              <label>
                <input
                  type="checkbox"
                  checked={!!ingredient.complete}
                  onChange={(e) =>
                    setComplete(ingredient, index, e.target.checked)
                  }
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
            )}

            {ingredient.complete && !editing && (
              <div className="sil-strikethrough" />
            )}

            {editing ? (
              <MultilineInput
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
                variant="naked"
              />
            ) : (
              <span className="sil-item-text">{ingredient.ingredient}</span>
            )}
          </div>
          {!!includedInRecipes.length && (
            <span className="sil-included-in">
              {includedInRecipes.map((r) => r.name).join(", ")}
            </span>
          )}
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
});

ShoppingIngredientItem.displayName = "ShoppingIngredientItem";
export default ShoppingIngredientItem;
