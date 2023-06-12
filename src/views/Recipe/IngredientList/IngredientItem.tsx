import { Reorder, useDragControls } from "framer-motion";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { Ingredient } from "../../../@modules/types/recipes";

import classNames from "../../../@modules/utils/classNames";
import { editIngredient } from "../../../components/Dialogs/EditIngredientDialog";
import SwipeToDelete from "../../../components/SwipeToDelete";

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

  const setIngredientValue = (value: string) => {
    const newIngredient = structuredClone(ingredient);
    newIngredient.value = value;
    updateIngredient(newIngredient);
  };

  const setIngredient = (ingredientValue: string) => {
    const newIngredient = structuredClone(ingredient);
    newIngredient.ingredient = ingredientValue;
    updateIngredient(newIngredient);
  };

  if (!editing) {
    return (
      <div className="ingredient-item">
        {ingredient.subHeading ? (
          <span className="subheading">{ingredient.value}</span>
        ) : (
          <>
            <span>&bull;</span>
            <span>
              {ingredient.value} <b>{ingredient.ingredient}</b>
            </span>
          </>
        )}
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
      <SwipeToDelete onDelete={deleteIngredient} editing={editing}>
        <div className="ingredient-item">
          <span
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </span>

          <MultilineInput
            className={classNames(
              "value-field",
              ingredient.subHeading && "subheading"
            )}
            placeholder={ingredient.subHeading ? "Section:" : "amount"}
            value={ingredient.value}
            onChange={(value) => setIngredientValue(value)}
            variant="naked"
          />

          {!ingredient.subHeading && (
            <button
              className="ingredient-field ra-input"
              onClick={async () => {
                const newIngredient = await editIngredient(
                  ingredient.ingredient
                );
                if (newIngredient) {
                  setIngredient(newIngredient);
                }
              }}
            >
              {ingredient.ingredient || (
                <span className="placeholder">ingredient</span>
              )}
            </button>
          )}
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
