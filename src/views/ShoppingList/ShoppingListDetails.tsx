import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

import { deleteList, saveList } from "../../@modules/api/shoppingLists";
import { useList } from "../../@modules/stores/shoppingLists";
import { Ingredient } from "../../@modules/types/recipes";
import { ShoppingList } from "../../@modules/types/shoppingLists";
import mergeIngredients from "../../@modules/utils/mergeIngredients";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import ContentEditable from "../../components/ContentEditable";
import { selectRecipe } from "../../components/Dialogs/RecipeSelectorDialog";
import DropMenu from "../../components/DropMenu";
import { RecipeItem } from "../../components/RecipeItem";
import SwipeToDelete from "../../components/SwipeToDelete";

import { ShoppingIngredientList } from "./ShoppingIngredientList";

export default function ShoppingListDetailsView() {
  const { listId } = useParams();
  const navigate = useNavigate();

  const originalList = useList(listId as string);
  const [list, setList] = useState<ShoppingList | undefined>(originalList);
  const updateList = useUpdater<ShoppingList>(list, (l) => {
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

  const removeRecipe = async (index: number) => {
    updateList((l) => l.recipeIds.splice(index, 1));
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

  const handleMenu = (option: string) => {
    if (!list) throw "List not loaded";

    if (option === "DELETE") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this shopping list?"
      );
      if (confirmed) {
        deleteList(list._id);
        navigate(-1);
      }
    }
  };

  if (!list) {
    return <span className="ra-error-message">Shopping list not found...</span>;
  }

  return (
    <div className="ra-view shopping-list-view">
      <AppHeader subView>
        <div className="ra-actions">
          <DropMenu
            icon="more_vert"
            options={[
              {
                icon: "delete",
                value: "DELETE",
                text: "Delete Shopping List",
                color: "var(--color-danger)",
              },
            ]}
            onSelect={handleMenu}
          />
        </div>
      </AppHeader>

      <div className="ra-view-content">

        <ContentEditable
          className="ra-title"
          value={list.name || "Untitled List"}
          onChange={(v) => setListName(v)}
          naked
        />

        <header className="ra-header">
          <h3>Recipes</h3>
          <button className="chip-button" onClick={addRecipe}>
            <i className="material-symbols-rounded">add</i>
          Add Recipe
          </button>
        </header>

        <div className="ra-dense-list">
          {list.recipeIds.map((recipeId, i) => (
            <SwipeToDelete
              key={recipeId}
              onDelete={() => removeRecipe(i)}
              onClick={() => navigate(`/recipe/${recipeId}`)}
            >
              <RecipeItem recipeId={recipeId} />
            </SwipeToDelete>
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
      </div>
    </div>
  );
}
