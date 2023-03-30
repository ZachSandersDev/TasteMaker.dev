import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { v4 as uuid } from "uuid";
import { Reorder } from "framer-motion";

import { saveList } from "../@modules/api/shoppingLists";
import { Ingredient } from "../@modules/types/recipes";
import { ShoppingList } from "../@modules/types/shoppingLists";

import AppHeader from "../components/AppHeader";
import IngredientItem from "../components/IngredientItem";

import "./ShoppingListView.scss";

import ContentEditable from "react-contenteditable";
import { useList } from "../@modules/stores/shoppingLists";

function useNullishUpdater<T>(
  value: T | undefined | null,
  setValue: (newVal: T) => void
) {
  return function (update: (currentVal: T) => unknown) {
    if (value === undefined || value === null) {
      throw "Original value has not been loaded yet";
    }

    const newValue = structuredClone(value);
    update(newValue);
    setValue(newValue);
  };
}

export default function ShoppingListView() {
  const { listId } = useParams();

  const originalList = useList(listId as string);
  const [list, setList] = useState<ShoppingList | undefined>(originalList);
  const updateList = useNullishUpdater<ShoppingList>(list, setList);

  useEffect(() => {
    if (originalList && !list) {
      setList(originalList);
    }
  }, [originalList]);

  const setListName = (value: string) => {
    updateList((l) => (l.name = value));
  };

  const addNewIngredient = () => {
    updateList((l) =>
      l.ingredients.push({
        value: "",
        units: "",
        ingredient: "",
        _id: uuid(),
      })
    );
  };

  const reorderIngredients = (ingredients: Ingredient[]) => {
    updateList((r) => (r.ingredients = ingredients));
  };

  const save = () => {
    if (!list) throw "Shopping List is not loaded yet";
    saveList(list);
  };

  return (
    <div className="ra-view">
      {list ? (
        <>
          <AppHeader subView>
            <ContentEditable
              className="name-field"
              html={list.name || "Untitled List"}
              onChange={(e) => setListName(e.target.value)}
            />

            <button
              className="icon-button material-symbols-rounded"
              onClick={save}
            >
              save
            </button>
          </AppHeader>

          <section className="list-section">
            <Reorder.Group
              className="list-list"
              axis="y"
              as="div"
              values={list.ingredients}
              onReorder={reorderIngredients}
            >
              {list.ingredients.map((ingredient, i) => (
                <IngredientItem
                  ingredient={ingredient}
                  index={i}
                  key={ingredient._id}
                  updateIngredient={(newIngredient) =>
                    updateList((r) => r.ingredients.splice(i, 1, newIngredient))
                  }
                  deleteIngredient={() =>
                    updateList((r) => r.ingredients.splice(i, 1))
                  }
                />
              ))}
            </Reorder.Group>

            <button className="chip-button" onClick={addNewIngredient}>
              <i className="material-symbols-rounded">add</i>
              New Ingredient
            </button>
          </section>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
