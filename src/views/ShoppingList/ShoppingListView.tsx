import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

import { saveList } from "../../@modules/api/shoppingLists";
import { Ingredient, Recipe } from "../../@modules/types/recipes";
import { ShoppingList } from "../../@modules/types/shoppingLists";

import AppHeader from "../../components/AppHeader";

import "./ShoppingListView.scss";

import { useList } from "../../@modules/stores/shoppingLists";
import { RecipeItem } from "../../components/RecipeItem";
import { selectRecipe } from "../../components/Dialogs/RecipeSelectorDialog";
import { ShoppingIngredientList } from "./ShoppingIngredientList";
import ContentEditable from "../../components/ContentEditable";

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

function mergeIngredients(recipe: Recipe, list: ShoppingList) {
  for (const recipeIngredient of recipe.ingredients) {
    let listIngredient = list.ingredients.find(
      (li) =>
        li.ingredient === recipeIngredient.ingredient &&
        li.units === recipeIngredient.units
    );

    if (listIngredient) {
      listIngredient.value = (
        Number(listIngredient.value) + Number(recipeIngredient.value)
      ).toString();
    } else {
      listIngredient = recipeIngredient;
      list.ingredients.push(listIngredient);
    }
  }
}

export function ShoppingListView() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const originalList = useList(listId as string);
  const [list, setList] = useState<ShoppingList | undefined>(originalList);
  const updateList = useNullishUpdater<ShoppingList>(list, (l) => {
    setList(l);
    saveList(l);
  });

  useEffect(() => {
    if (originalList && !list) {
      setList(originalList);
    }
  }, [originalList]);

  const addRecipe = async () => {
    try {
      const newRecipe = await selectRecipe();
      if (!newRecipe) return;

      updateList((l) => {
        l.recipeIds.push(newRecipe._id);
        mergeIngredients(newRecipe, l);
      });
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <div className="ra-view shopping-list-view">
      {list ? (
        <>
          <AppHeader subView>
            <ContentEditable
              value={list.name || "Untitled List"}
              onChange={(v) => setListName(v)}
              naked
            />
          </AppHeader>

          <header className="ra-header">
            <h3>Recipes</h3>
            <button className="chip-button" onClick={addRecipe}>
              <i className="material-symbols-rounded">add</i>
              Add Recipe
            </button>
          </header>

          <div className="ra-list">
            {list.recipeIds.map((recipeId) => (
              <RecipeItem
                recipeId={recipeId}
                onClick={() => navigate(`/recipe/${recipeId}`)}
              />
            ))}
          </div>

          <ShoppingIngredientList
            list={list}
            onNew={addNewIngredient}
            onUpdate={(newIngredient, i) =>
              updateList((r) => r.ingredients.splice(i, 1, newIngredient))
            }
            onDelete={(i) => updateList((r) => r.ingredients.splice(i, 1))}
            onReorder={reorderIngredients}
          />
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
