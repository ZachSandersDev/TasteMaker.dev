import { Reorder, useDragControls } from "framer-motion";
import { KeyboardEvent, forwardRef } from "react";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { useRecipeList } from "../../../@modules/hooks/recipes";
import { ShoppingListIngredient } from "../../../@modules/types/shoppingLists";

import classNames from "../../../@modules/utils/classNames";
import SwipeToDelete from "../../../components/SwipeToDelete";

export interface ShoppingIngredientItemProps {
  ingredient: ShoppingListIngredient;
  editing?: boolean;
  onUpdate: (i: ShoppingListIngredient) => void;
  onDelete: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const ShoppingIngredientItem = forwardRef<
  HTMLTextAreaElement,
  ShoppingIngredientItemProps
>(({ ingredient, editing, onUpdate, onDelete, onKeyDown }, ref) => {
  const controls = useDragControls();

  const { recipeList } = useRecipeList(ingredient.fromRecipes || []);

  const setComplete = (
    ingredient: ShoppingListIngredient,
    complete?: boolean
  ) => {
    const newIngredient = structuredClone(ingredient);
    newIngredient.complete = complete;
    onUpdate(newIngredient);
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
                onChange={(e) => setComplete(ingredient, e.target.checked)}
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
          {!!recipeList.length && (
            <span className="sil-included-in">
              {recipeList.map((r, i) => (
                <span key={r._id}>
                  {r.name}
                  {i !== recipeList.length - 1 && ", "}
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
      <SwipeToDelete onDelete={onDelete}>
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
                  onChange={(e) => setComplete(ingredient, e.target.checked)}
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
                  onUpdate(newIngredient);
                }}
                onKeyDown={onKeyDown}
                ref={ref}
                variant="naked"
              />
            ) : (
              <span className="sil-item-text">{ingredient.ingredient}</span>
            )}
          </div>
          {!!recipeList.length && (
            <span className="sil-included-in">
              {recipeList.map((r) => r.name).join(", ")}
            </span>
          )}
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
});

ShoppingIngredientItem.displayName = "ShoppingIngredientItem";
export default ShoppingIngredientItem;
