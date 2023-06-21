import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

import Button from "../../@design/components/Button/Button";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { getRecipe } from "../../@modules/api/recipes";
import { deleteList } from "../../@modules/api/shoppingLists";
import { getRecipeCacheKey } from "../../@modules/hooks/recipes";
import { useShoppingList } from "../../@modules/hooks/shoppingLists";
import { Ingredient } from "../../@modules/types/recipes";
import { swrOnce } from "../../@modules/utils/cache";
import mergeIngredients from "../../@modules/utils/mergeIngredients";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import { useSelectRecipe } from "../../components/Dialogs/RecipeSelectorDialog";

import Loading from "../../components/Loading";

import { ShoppingIngredientList } from "./IngredientList/ShoppingIngredientList";

export default function ShoppingListDetailsView() {
  const { listId = "" } = useParams();
  const navigate = useNavigate();
  const [editing, setEditing] = useState<boolean>(false);
  const selectRecipe = useSelectRecipe();

  const { shoppingListLoading, shoppingList, updateShoppingList } =
    useShoppingList(listId);

  useEffect(() => {
    if (shoppingList) {
      document.title = shoppingList.name || "Untitled Shopping List";
    }

    if (shoppingList && !shoppingList.name) {
      setEditing(true);
      if (!shoppingList.ingredients.length) {
        addNewIngredient();
      }
    }
  }, [shoppingList]);

  const addRecipe = async () => {
    try {
      const newRecipeParams = await selectRecipe();
      if (!newRecipeParams) return;

      const newRecipe = await swrOnce(getRecipeCacheKey(newRecipeParams), () =>
        getRecipe(newRecipeParams)
      );
      if (!newRecipe) return;

      updateShoppingList((l) => {
        mergeIngredients(newRecipeParams, newRecipe, l);
      });
    } catch (err) {
      console.error(err);
    }
  };

  const setListName = (value: string) => {
    updateShoppingList((l) => (l.name = value));
  };

  const addNewIngredient = (at?: number) => {
    updateShoppingList((l) => {
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
    updateShoppingList((r) => (r.ingredients = ingredients));
  };

  const handleDeleteList = () => {
    if (!shoppingList) throw "List not loaded";

    const confirmed = window.confirm(
      "Are you sure you want to delete this shopping list?"
    );
    if (confirmed) {
      deleteList(shoppingList._id);
      navigate("/shopping-lists");
    }
  };

  if (shoppingListLoading || !shoppingList) {
    return <Loading />;
  }

  return (
    <AppView
      header={
        <AppHeader subView>
          <div className="ra-actions">
            <Button
              title="Edit"
              onClick={() => setEditing(!editing)}
              variant={editing ? "chip" : "naked-chip"}
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
              title="Delete shoppingList"
              onClick={handleDeleteList}
              variant="icon"
              iconBefore="delete"
            />
          </div>
        </AppHeader>
      }
    >
      <div className="ra-header">
        <MultilineInput
          className="ra-title"
          value={shoppingList.name}
          placeholder="Untitled Shopping List"
          onChange={(v) => setListName(v)}
          variant="naked"
          disabled={!editing}
        />
      </div>

      <ShoppingIngredientList
        list={shoppingList}
        onNew={addNewIngredient}
        onUpdate={(newIngredient, i) =>
          updateShoppingList((r) => r.ingredients.splice(i, 1, newIngredient))
        }
        onDelete={(i) => updateShoppingList((r) => r.ingredients.splice(i, 1))}
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
