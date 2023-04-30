import { Reorder, useDragControls } from "framer-motion";

import ContentEditable from "../../../../@design/components/ContentEditable/ContentEditable";
import { Ingredient } from "../../../../@modules/types/recipes";

import { editIngredient } from "../../../../components/Dialogs/EditIngredientDialog";
import SwipeToDelete from "../../../../components/SwipeToDelete";

import "./IngredientItem.scss";

export interface IngredientItemProps {
  ingredient: Ingredient;
  updateIngredient: (i: Ingredient) => void;
  deleteIngredient: () => void;
  editing: boolean;
}

export default function IngredientItem({
  ingredient,
  updateIngredient,
  deleteIngredient,
  editing,
}: IngredientItemProps) {
  const controls = useDragControls();

  const setIngredientValue = (key: keyof Ingredient, value: string) => {
    const newIngredient = structuredClone(ingredient);
    newIngredient[key] = value;
    updateIngredient(newIngredient);
  };

  if (!editing) {
    return (
      <div className="ingredient-item">
        <span>&bull;</span>
        <span>
          {ingredient.value} <b>{ingredient.ingredient}</b>
        </span>
      </div>
    );
  }

  return (
    <Reorder.Item
      value={ingredient}
      dragListener={false}
      dragControls={controls}
      as="div"
    >
      <SwipeToDelete onDelete={deleteIngredient}>
        <div className="ingredient-row">
          <span
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </span>

          <ContentEditable
            className="value-field"
            placeholder="amount"
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
