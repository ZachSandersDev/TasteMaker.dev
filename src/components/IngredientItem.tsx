import { Reorder, useDragControls } from "framer-motion";
import { useRecoilValue } from "recoil";

import { ingredientStore } from "../@modules/stores/ingredients";
import { Ingredient } from "../@modules/types/recipes";
import useMediaQuery from "../@modules/utils/useMediaQuery";

import { editIngredient } from "./Dialogs/EditIngredientDialog";
import SwipeToDelete from "./SwipeToDelete";

import "./IngredientItem.scss";
import ContentEditable from "./ContentEditable";

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
  const { ingredients } = useRecoilValue(ingredientStore);
  const isMobile = useMediaQuery("(max-width: 999px)");

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
            // type="number"
            value={ingredient.value}
            // size={ingredient.value.length}
            onChange={(e) => setIngredientValue("value", e)}
            naked
            plaintext
          />

          <ContentEditable
            className="unit-field"
            placeholder="unit"
            // list="unit-options"
            value={ingredient.units}
            onChange={(e) => setIngredientValue("units", e)}
            naked
            plaintext
          />
          {/* <datalist id="unit-options">
            <option value="cups" />
            <option value="tbsp" />
            <option value="tsp" />
            <option value="g" />
            <option value="lbs" />
            <option value="oz" />
            <option value="fl oz" />
          </datalist> */}

          <button
            className="ingredient-field ra-input"
            onClick={async () => {
              const newIngredient = await editIngredient(ingredient.ingredient);
              if (newIngredient) {
                setIngredientValue("ingredient", newIngredient);
              }
            }}
          >
            {ingredient.ingredient}
          </button>
        </div>

        {/* {isMobile ? (
          <div className="ingredient-item-swipe">
            <input
              className="ra-input value-field"
              placeholder="amt."
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

            <button
              className="ingredient-field ra-input"
              onClick={async () => {
                const newIngredient = await editIngredient(
                  ingredient.ingredient
                );
                if (newIngredient) {
                  setIngredientValue("ingredient", newIngredient);
                }
              }}
            >
              {ingredient.ingredient}
            </button>

            <div
              onPointerDown={(e) => controls.start(e)}
              style={{ touchAction: "none" }}
              className="material-symbols-rounded drag-handle"
            >
              drag_indicator
            </div>
          </div>
        ) : (
          <div className="ingredient-item-swipe">
            <input
              className="ra-input value-field"
              placeholder="amt."
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

            <input
              className="ingredient-field ra-input"
              placeholder="ingredient"
              list="ingredient-options"
              value={ingredient.ingredient}
              onChange={(v) => setIngredientValue("ingredient", v.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  addIngredient(ingredient.ingredient);
                }
              }}
            />
            <datalist id="ingredient-options">
              {ingredients?.map((i) => (
                <option key={i} value={i} />
              ))}
            </datalist>

            <div
              onPointerDown={(e) => controls.start(e)}
              style={{ touchAction: "none" }}
              className="material-symbols-rounded drag-handle"
            >
              drag_indicator
            </div>
          </div>
        )} */}
      </SwipeToDelete>
    </Reorder.Item>
  );
}
