import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

import Button from "../../@design/components/Button/Button";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { deleteList, saveList } from "../../@modules/api/shoppingLists";
import { useList } from "../../@modules/stores/shoppingLists";
import { Ingredient } from "../../@modules/types/recipes";
import { ShoppingList } from "../../@modules/types/shoppingLists";
import mergeIngredients from "../../@modules/utils/mergeIngredients";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import { selectRecipe } from "../../components/Dialogs/RecipeSelectorDialog";

import { ShoppingIngredientList } from "./IngredientList/ShoppingIngredientList";

export default function ShoppingListDetailsView() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<boolean>(false);

  const [list, setList] = useList(listId as string);
  const updateList = useUpdater<ShoppingList>(list, (l) => {
    setList(l);
    saveList(l);
  });

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

  const addNewIngredient = (at?: number) => {
    updateList((l) => {
      if (at !== undefined) {
        l.ingredients.splice(at, 0, {
          _id: uuid(),
          ingredient: "",
        });
      } else {
        l.ingredients.push({
          _id: uuid(),
          ingredient: "",
        });
      }
    });
  };

  const reorderIngredients = (ingredients: Ingredient[]) => {
    updateList((r) => (r.ingredients = ingredients));
  };

  const handleDeleteList = () => {
    if (!list) throw "List not loaded";

    const confirmed = window.confirm(
      "Are you sure you want to delete this shopping list?"
    );
    if (confirmed) {
      deleteList(list._id);
      navigate("/shopping-lists");
    }
  };

  if (!list) {
    return <span className="ra-error-message">Shopping list not found...</span>;
  }

  return (
    <AppView
      header={
        <AppHeader subView>
          <div className="ra-actions">
            <Button
              title="Edit"
              onClick={() => setEditing(!editing)}
              variant={editing ? "chip" : "naked"}
            >
              {editing ? "Save" : "Edit"}
            </Button>

            <Button
              title="Import ingredients from recipe"
              onClick={addRecipe}
              variant="icon"
              iconBefore="format_list_bulleted_add"
            />

            <Button
              title="Delete list"
              onClick={handleDeleteList}
              variant="icon"
              iconBefore="delete"
            />
          </div>
        </AppHeader>
      }
    >
      <div className="ra-view-header">
        {editing ? (
          <MultilineInput
            className="ra-title"
            value={list.name}
            placeholder="Untitled Shopping List"
            onChange={(v) => setListName(v)}
            variant="naked"
          />
        ) : (
          <span className="ra-title">
            {list.name || "Untitled Shopping List"}
          </span>
        )}
      </div>

      <ShoppingIngredientList
        list={list}
        onNew={addNewIngredient}
        onUpdate={(newIngredient, i) =>
          updateList((r) => r.ingredients.splice(i, 1, newIngredient))
        }
        onDelete={(i) => updateList((r) => r.ingredients.splice(i, 1))}
        onReorder={reorderIngredients}
        editing={editing}
      />

      {editing && (
        <div className="ra-card-header">
          <Button
            onClick={() => addNewIngredient()}
            iconBefore="add"
            variant="filled"
            size="sm"
          >
            New Item
          </Button>
        </div>
      )}
    </AppView>
  );
}
