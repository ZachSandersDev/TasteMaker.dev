import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authStore, listenForAuth } from "../@modules/stores/auth";
import { listenForRecipes, recipeStore } from "../@modules/stores/recipes";
import { listenForTree, treeStore } from "../@modules/stores/tree";
import { listenForLists, listStore } from "../@modules/stores/shoppingLists";

import router from "../@modules/router";

import RecipeSelectorDialog from "./Dialogs/RecipeSelectorDialog";
import Loading from "./Loading";

export default function Shell() {
  const { user } = useRecoilValue(authStore);
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
    }
  }, [user]);

  return user && !recipesLoading && !listsLoading && !treeLoading ? (
    <>
      <main>
        <RouterProvider router={router} />
      </main>

      <RecipeSelectorDialog />
    </>
  ) : (
    <Loading />
  );
}
