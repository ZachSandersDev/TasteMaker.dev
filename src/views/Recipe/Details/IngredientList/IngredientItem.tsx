import { Reorder, useDragControls } from "framer-motion";

import Button from "../../../../@design/components/Button";

import { Ingredient } from "../../../../@modules/types/recipes";

import ContentEditable from "../../../../components/ContentEditable";
import { editIngredient } from "../../../../components/Dialogs/EditIngredientDialog";

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
      className="ingredient-item editing"
      value={ingredient}
      dragListener={false}
      dragControls={controls}
      as="tr"
    >
      <td>
        <span
          onPointerDown={(e) => controls.start(e)}
          style={{ touchAction: "none" }}
          className="material-symbols-rounded drag-handle"
        >
          drag_indicator
        </span>
      </td>

      <td>
        <ContentEditable
          className="value-field"
          placeholder="amt."
          value={ingredient.value}
          onChange={(e) => setIngredientValue("value", e)}
          naked
          plaintext
        />
      </td>

      <td className="ingredient-field">
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
      </td>

      <td>
        <Button
          onClick={deleteIngredient}
          variant="icon"
          size="sm"
          color="var(--color-danger)"
        >
          clear
        </Button>
      </td>
    </Reorder.Item>
  );
}
