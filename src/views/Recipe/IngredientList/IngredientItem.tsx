import { Reorder, useDragControls } from "framer-motion";

import { KeyboardEvent, forwardRef } from "react";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { Ingredient } from "../../../@modules/types/recipes";

import classNames from "../../../@modules/utils/classNames";
import DropMenu from "../../../components/Dialogs/DropMenu/DropMenu";
import SwipeToDelete from "../../../components/SwipeToDelete";

import "./IngredientItem.scss";

export interface IngredientItemProps {
  ingredient: Ingredient;
  editing: boolean;
  updateIngredient: (i: Ingredient) => void;
  deleteIngredient: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const IngredientItem = forwardRef<
  HTMLTextAreaElement,
  IngredientItemProps
>(
  (
    { ingredient, updateIngredient, deleteIngredient, onKeyDown, editing },
    ref
  ) => {
    const controls = useDragControls();

    const setIngredientValue = (value: string) => {
      const newIngredient = structuredClone(ingredient);
      newIngredient.value = value;
      updateIngredient(newIngredient);
    };

    const setIngredientType = (type: "subheading" | "ingredient") => {
      const newIngredient = structuredClone(ingredient);
      newIngredient.subHeading = type === "subheading";
      updateIngredient(newIngredient);
    };

    if (!editing) {
      return (
        <div
          className={classNames(
            "ingredient-item",
            ingredient.subHeading && "subheading"
          )}
        >
          {ingredient.subHeading ? (
            <span>{ingredient.value}</span>
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
        className="ingredient-item-wrapper"
        value={ingredient}
        dragListener={false}
        dragControls={controls}
        as="div"
      >
        <SwipeToDelete onDelete={deleteIngredient}>
          <div
            className={classNames(
              "ingredient-item",
              ingredient.subHeading && "subheading"
            )}
          >
            <span
              onPointerDown={(e) => controls.start(e)}
              style={{ touchAction: "none" }}
              className="material-symbols-rounded drag-handle"
            >
              drag_indicator
            </span>

            <MultilineInput
              placeholder={ingredient.subHeading ? "Section:" : "Ingredient"}
              value={ingredient.value}
              onChange={(value) => setIngredientValue(value)}
              variant="naked"
              onKeyDown={onKeyDown}
              ref={ref}
            />

            <DropMenu
              icon="expand_more"
              options={[
                {
                  text: "Section Title",
                  icon: "title",
                  onClick: () => setIngredientType("subheading"),
                },
                {
                  text: "Ingredient",
                  icon: "notes",
                  onClick: () => setIngredientType("ingredient"),
                },
              ]}
            />
          </div>
        </SwipeToDelete>
      </Reorder.Item>
    );
  }
);
IngredientItem.displayName = "IngredientItem";
