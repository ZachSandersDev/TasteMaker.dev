import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import Button from "../../@design/components/Button/Button";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { getRecipe } from "../../@modules/api/recipes";
import { deleteList } from "../../@modules/api/shoppingLists";
import { getRecipeCacheKey } from "../../@modules/hooks/recipes";
import { useShoppingList } from "../../@modules/hooks/shoppingLists";
import { swrOnce } from "../../@modules/utils/cache";
import mergeIngredients from "../../@modules/utils/mergeIngredients";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import DropMenu from "../../components/Dialogs/DropMenu/DropMenu";
import { useSelectRecipe } from "../../components/Dialogs/RecipeSelectorDialog";

import Loading from "../../components/Loading";

import IngredientList from "../Recipe/IngredientList/IngredientList";

export default function ShoppingListDetailsView() {
  const { listId = "" } = useParams();
  const navigate = useNavigate();
  const selectRecipe = useSelectRecipe();

  const [editing, setEditing] = useState<boolean>(false);

  const { shoppingListLoading, shoppingList, updateShoppingList } =
    useShoppingList(listId);

  useEffect(() => {
    if (shoppingList) {
      document.title = shoppingList.name || "Untitled Shopping List";
    }

    if (shoppingList && !shoppingList.name) {
      setEditing(true);
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

            <DropMenu
              options={[
                {
                  text: "Import ingredients from recipe",
                  icon: "format_list_bulleted_add",
                  onClick: addRecipe,
                },
                {
                  text: "Delete shopping list",
                  icon: "delete",
                  onClick: handleDeleteList,
                },
              ]}
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

      <IngredientList
        ingredients={shoppingList.ingredients}
        editing={editing}
        updateRecipe={updateShoppingList}
        checklist
      />
    </AppView>
  );
}
