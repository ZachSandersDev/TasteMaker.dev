import { Reorder, useDragControls } from "framer-motion";

import { Ingredient } from "../@modules/types/recipes";

import ContentEditable from "./ContentEditable";
import { editIngredient } from "./Dialogs/EditIngredientDialog";
import SwipeToDelete from "./SwipeToDelete";

import "./IngredientItem.scss";

export interface IngredientItemProps {
  ingredient: Ingredient;
  updateIngredient: (i: Ingredient) => void;
  deleteIngredient: () => void;
}

export default function IngredientItem({
  ingredient,
  updateIngredient,
  deleteIngredient,
}: IngredientItemProps) {
  const controls = useDragControls();

  const setIngredientValue = (key: keyof Ingredient, value: string) => {
    const newIngredient = structuredClone(ingredient);
    newIngredient[key] = value;
    updateIngredient(newIngredient);
  };

  return (
    <Reorder.Item
      className="ingredient-item"
      value={ingredient}
      dragListener={false}
      dragControls={controls}
    >
      <SwipeToDelete
        className="ingredient-item-container"
        onDelete={deleteIngredient}
      >
        <div className="ingredient-item-swipe">
          <div
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </div>

          <ContentEditable
            className="value-field"
            placeholder="amt."
            value={ingredient.value}
            onChange={(e) => setIngredientValue("value", e)}
            naked
            plaintext
          />

          <button
            className="ingredient-field ra-input"
            onClick={async () => {
              const newIngredient = await editIngredient(ingredient.ingredient);
              if (newIngredient) {
                setIngredientValue("ingredient", newIngredient);
              }
            }}
          >
            {ingredient.ingredient || (
              <span className="placeholder">ingredient</span>
            )}
          </button>
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
