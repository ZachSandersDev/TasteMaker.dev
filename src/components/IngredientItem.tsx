import { Reorder, useDragControls } from "framer-motion";
import SwipeToDelete from "react-swipe-to-delete-ios";

import { Ingredient, Recipe } from "../@modules/types/recipes";
import ContentEditable from "./ContentEditable";

import "./IngredientItem.scss";

export interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
  updateIngredient: (i: Ingredient) => void;
  deleteIngredient: () => void;
}

export default function IngredientItem({
  ingredient,
  index,
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
          <span>&bull;</span>
          <input
            className="ra-input value-field"
            placeholder="quantity"
            type="number"
            value={ingredient.value}
            size={ingredient.value.length}
            onChange={(e) => setIngredientValue("value", e.target.value)}
          />
          <input
            className="ra-input unit-field"
            placeholder="unit"
            list="unit-options"
            value={ingredient.units}
            onChange={(e) => setIngredientValue("units", e.target.value)}
          />
          <datalist id="unit-options">
            <option value="cups" />
            <option value="tbsp" />
            <option value="tsp" />
            <option value="g" />
            <option value="lbs" />
            <option value="oz" />
            <option value="fl oz" />
          </datalist>
          <ContentEditable
            placeholder="ingredient"
            className="ingredient-field"
            value={ingredient.ingredient}
            onChange={(v) => setIngredientValue("ingredient", v)}
          />
          <div
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </div>
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
