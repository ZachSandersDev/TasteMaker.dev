import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import router from "../@modules/router";
import { authStore, listenForAuth } from "../@modules/stores/auth";
import { listenForIngredients } from "../@modules/stores/ingredients";
import { listenForRecipes, recipeStore } from "../@modules/stores/recipes";
import { listenForLists, listStore } from "../@modules/stores/shoppingLists";
import { listenForTree, treeStore } from "../@modules/stores/tree";

import DropMenuDialog from "./Dialogs/DropMenu/DropMenuDialog";

import EditIngredientDialog from "./Dialogs/EditIngredientDialog";
import ImportRecipeDialog from "./Dialogs/ImportRecipeDialog";
import RecipeSelectorDialog from "./Dialogs/RecipeSelectorDialog";
import Loading from "./Loading";

export default function Shell() {
  const { loading: userLoading, user } = useRecoilValue(authStore);
  const { loading: recipesLoading } = useRecoilValue(recipeStore);
  const { loading: listsLoading } = useRecoilValue(listStore);
  const { loading: treeLoading } = useRecoilValue(treeStore);

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    if (user) {
      listenForRecipes();
      listenForTree();
      listenForLists();
      listenForIngredients();
    }
  }, [user]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.navigate("/login");
    }
  }, [userLoading, user]);

  return (!userLoading && !user) ||
    (user && !recipesLoading && !listsLoading && !treeLoading) ? (
    <>
      <main>
        <RouterProvider router={router} />
      </main>

      <RecipeSelectorDialog />
      <EditIngredientDialog />
      <ImportRecipeDialog />
      <DropMenuDialog />
    </>
  ) : (
    <Loading />
  );
}
