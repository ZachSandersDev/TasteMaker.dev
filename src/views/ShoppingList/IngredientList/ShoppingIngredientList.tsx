import { Reorder } from "framer-motion";
import { v4 as uuid } from "uuid";

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
  onUpdate: (ingredient: Ingredient, index: number) => void;
  onDelete: (index: number) => void;
  onReorder: (ingredients: Ingredient[]) => void;
}

const DEFAULT_ITEM: ShoppingListIngredient = {
  _id: uuid(),
  complete: false,
  value: "",
  units: "",
  ingredient: "",
};

export function ShoppingIngredientList(props: ShoppingIngredientListProps) {
  const { list, onReorder } = props;

  return (
    <>
      <Reorder.Group
        className="ra-list"
        values={list.ingredients}
        onReorder={onReorder}
      >
        {(list.ingredients.length
          ? list.ingredients
          : [structuredClone(DEFAULT_ITEM)]
        ).map((ingredient, index) => (
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
