import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import router from "../@modules/router";
import { authStore, listenForAuth } from "../@modules/stores/auth";
import { folderStore } from "../@modules/stores/folders";
import { recipeStore } from "../@modules/stores/recipes";
import { listStore } from "../@modules/stores/shoppingLists";

import EditIngredientDialog from "./Dialogs/EditIngredientDialog";
import ImportRecipeDialog from "./Dialogs/ImportRecipeDialog";
import RecipeSelectorDialog from "./Dialogs/RecipeSelectorDialog";
import TextInputDialog from "./Dialogs/TextInputDialog";
import Loading from "./Loading";

export default function Shell() {
  const { loading: userLoading, user } = useRecoilValue(authStore);
  const { loading: recipesLoading } = useRecoilValue(recipeStore);
  const { loading: listsLoading } = useRecoilValue(listStore);
  const { loading: foldersLoading } = useRecoilValue(folderStore);

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    if (!userLoading && !user && !location.pathname.includes("/public/")) {
      router.navigate("/login");
    }
  }, [userLoading, user]);

  if (
    (!user && userLoading) ||
    recipesLoading ||
    listsLoading ||
    foldersLoading
  ) {
    return <Loading />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <RecipeSelectorDialog />
      <EditIngredientDialog />
      <ImportRecipeDialog />
      <TextInputDialog />
    </>
  );
}
