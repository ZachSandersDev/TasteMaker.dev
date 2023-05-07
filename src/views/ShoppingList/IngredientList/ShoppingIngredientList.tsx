import { Reorder } from "framer-motion";

import { KeyboardEvent, useEffect, useRef } from "react";

import { Ingredient } from "../../../@modules/types/recipes";
import {
  ShoppingList,
  ShoppingListIngredient,
} from "../../../@modules/types/shoppingLists";

import ShoppingIngredientItem from "./ShoppingIngredientItem";

import "./ShoppingIngredientList.scss";

export interface ShoppingIngredientListProps {
  list: ShoppingList;
  onNew: (at?: number) => void;
  onUpdate: (ingredient: ShoppingListIngredient, index: number) => void;
  onDelete: (index: number) => void;
  onReorder: (ingredients: Ingredient[]) => void;
  editing?: boolean;
}

export function ShoppingIngredientList(props: ShoppingIngredientListProps) {
  const { list, onReorder, onNew, onDelete } = props;

  const editorRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nextTickFocus = useRef<number | null>(null);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onNew(index + 1);
      nextTickFocus.current = index + 1;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      editorRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      editorRefs.current[index - 1]?.focus();
    } else if (
      e.key === "Backspace" &&
      (e.target as HTMLDivElement).innerHTML === ""
    ) {
      e.preventDefault();
      onDelete(index);

      if (index === 0) {
        nextTickFocus.current = 1;
      } else {
        nextTickFocus.current = index - 1;
      }
    }
  };

  useEffect(() => {
    if (nextTickFocus.current !== null) {
      editorRefs.current[nextTickFocus.current]?.focus();
      nextTickFocus.current = null;
    }
  });

  return (
    <>
      <Reorder.Group
        className="ra-list"
        values={list.ingredients}
        onReorder={onReorder}
      >
        {list.ingredients.map((ingredient, index) => (
          <ShoppingIngredientItem
            key={ingredient._id}
            ingredient={ingredient}
            index={index}
            ref={(el) => (editorRefs.current[index] = el)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            {...props}
          />
        ))}
      </Reorder.Group>
    </>
  );
}
