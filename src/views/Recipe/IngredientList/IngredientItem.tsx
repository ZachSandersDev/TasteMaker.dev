import { Reorder, useDragControls } from "framer-motion";

import { KeyboardEvent, forwardRef, useEffect } from "react";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { useRecipeList } from "../../../@modules/hooks/recipes";
import { parseIngredient } from "../../../@modules/parsers/parseIngredient";
import { Ingredient } from "../../../@modules/types/recipes";

import classNames from "../../../@modules/utils/classNames";
import { DragHandle } from "../../../components/DragHandle";
import SwipeToDelete from "../../../components/SwipeToDelete";

import "./IngredientItem.scss";

export interface IngredientItemProps {
  ingredient: Ingredient;
  editing: boolean;
  checklist?: boolean;
  onUpdate: (i: Ingredient) => void;
  onDelete: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const IngredientItem = forwardRef<
  HTMLTextAreaElement,
  IngredientItemProps
>(
  (
    { ingredient, onUpdate, onDelete, onKeyDown, editing, checklist = false },
    ref
  ) => {
    const controls = useDragControls();
    const { recipeList } = useRecipeList(ingredient.fromRecipes || []);

    useEffect(() => {
      if (ingredient.units || ingredient.ingredient) {
        const newIngredient = structuredClone(ingredient);
        newIngredient.value = [
          newIngredient.value,
          newIngredient.units,
          newIngredient.ingredient,
        ]
          .filter(Boolean)
          .join(" ");

        newIngredient.units = "";
        newIngredient.ingredient = "";
        onUpdate(newIngredient);
      }
    }, [ingredient]);

    const setIngredientValue = (value: string) => {
      const newIngredient = structuredClone(ingredient);
      newIngredient.value = value;
      onUpdate(newIngredient);
    };

    const setIngredientComplete = (complete: boolean) => {
      const newIngredient = structuredClone(ingredient);
      newIngredient.complete = complete;
      onUpdate(newIngredient);
    };

    const setIngredientType = (type: "subheading" | "ingredient") => {
      const newIngredient = structuredClone(ingredient);
      newIngredient.subHeading = type === "subheading";
      onUpdate(newIngredient);
    };

    if (!editing) {
      const ingredientStr = parseIngredient(ingredient);
      return (
        <div
          className={classNames(
            "ingredient-item",
            ingredient.subHeading && "subheading",
            ingredient.complete && "ingredient-checkbox-checked"
          )}
        >
          {ingredient.subHeading && <span>{ingredient.value}</span>}
          {!ingredient.subHeading && checklist && (
            <label>
              <input
                type="checkbox"
                checked={!!ingredient.complete}
                onChange={(e) => setIngredientComplete(e.target.checked)}
              />
              <span className="ingredient-checkbox material-symbols-rounded">
                {ingredient.complete ? "check" : ""}
              </span>

              <div className="ingredient-item-text">
                <span>{ingredient.value}</span>
                {!!recipeList.length && (
                  <span className="ingredient-included-in">
                    {recipeList.map((r, i) => (
                      <span key={r._id}>
                        {r.name}
                        {i !== recipeList.length - 1 && ", "}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </label>
          )}
          {!ingredient.subHeading && !checklist && (
            <>
              <span>&bull;</span>
              <span>
                {ingredient.value.replace(ingredientStr, "").trim()}{" "}
                <b>{ingredientStr}</b>
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
        <SwipeToDelete onDelete={onDelete}>
          <div
            className={classNames(
              "ingredient-item",
              ingredient.subHeading && "subheading"
            )}
          >
            <DragHandle
              controls={controls}
              options={[
                {
                  text: "Section title",
                  icon: "title",
                  onClick: () => setIngredientType("subheading"),
                },
                {
                  text: "Ingredient",
                  icon: "notes",
                  onClick: () => setIngredientType("ingredient"),
                },
                {
                  text: "Delete",
                  icon: "delete",
                  onClick: onDelete,
                },
              ]}
            />

            <div className="ingredient-item-text">
              <MultilineInput
                placeholder={ingredient.subHeading ? "Section:" : "Ingredient"}
                value={ingredient.value}
                onChange={(value) => setIngredientValue(value)}
                variant="naked"
                onKeyDown={onKeyDown}
                ref={ref}
              />

              {!!recipeList.length && (
                <span className="ingredient-included-in">
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
        </SwipeToDelete>
      </Reorder.Item>
    );
  }
);
IngredientItem.displayName = "IngredientItem";
