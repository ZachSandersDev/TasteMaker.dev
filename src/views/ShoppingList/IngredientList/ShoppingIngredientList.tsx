import { Reorder } from "framer-motion";

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
}

export function ShoppingIngredientList(props: ShoppingIngredientListProps) {
  const { list, onReorder } = props;

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
            {...props}
          />
        ))}
      </Reorder.Group>
    </>
  );
}
