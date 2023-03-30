import { Reorder, useDragControls } from "framer-motion";
import ContentEditable from "react-contenteditable";

import { Ingredient, Recipe } from "../@modules/types/recipes";

import "./IngredientItem.scss";

export interface IngredientItemProps {
  ingredient: Ingredient;
  index: number;
  updateRecipe: (update: (r: Recipe) => unknown) => void;
}

export default function IngredientItem({
  ingredient,
  index,
  updateRecipe,
}: IngredientItemProps) {
  const controls = useDragControls();

  const setIngredientValue = (
    index: number,
    key: keyof Ingredient,
    value: string
  ) => {
    updateRecipe((r) => (r.ingredients[index][key] = value));
  };

  return (
    <Reorder.Item
      className="ingredient-item"
      value={ingredient}
      dragListener={false}
      dragControls={controls}
    >
      <span>&bull;</span>

      <input
        className="ra-input value-field"
        placeholder="quantity"
        type="number"
        value={ingredient.value}
        size={ingredient.value.length}
        onChange={(e) => setIngredientValue(index, "value", e.target.value)}
      />
      <input
        className="ra-input unit-field"
        placeholder="unit"
        list="unit-options"
        value={ingredient.units}
        onChange={(e) => setIngredientValue(index, "units", e.target.value)}
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
        className="ra-input ingredient-field"
        html={ingredient.ingredient}
        onChange={(e) =>
          setIngredientValue(index, "ingredient", e.target.value)
        }
      />

      <div
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: "none" }}
      >
        <span className="material-symbols-rounded drag-handle">
          drag_indicator
        </span>
      </div>
    </Reorder.Item>
  );
}
