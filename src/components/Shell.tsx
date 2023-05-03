import { User } from "firebase/auth";
import { useEffect, useRef } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import router from "../@modules/router";
import { authStore, listenForAuth } from "../@modules/stores/auth";
import { folderStore, listenForFolders } from "../@modules/stores/folders";
import { listenForIngredients } from "../@modules/stores/ingredients";
import { listenForRecipes, recipeStore } from "../@modules/stores/recipes";
import { listenForLists, listStore } from "../@modules/stores/shoppingLists";

import EditIngredientDialog from "./Dialogs/EditIngredientDialog";
import ImportRecipeDialog from "./Dialogs/ImportRecipeDialog";
import RecipeSelectorDialog from "./Dialogs/RecipeSelectorDialog";
import Loading from "./Loading";

export default function Shell() {
  const { loading: userLoading, user } = useRecoilValue(authStore);
  const { loading: recipesLoading } = useRecoilValue(recipeStore);
  const { loading: listsLoading } = useRecoilValue(listStore);
  const { loading: foldersLoading } = useRecoilValue(folderStore);

  const prevUser = useRef<User | undefined>(undefined);

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    if (user && prevUser.current?.uid !== user.uid) {
      listenForRecipes();
      listenForFolders();
      listenForLists();
      listenForIngredients();
    }

    prevUser.current = user;
  }, [user]);

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
    </>
  );
}
