import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import router from "../@modules/router";
import { authStore, listenForAuth } from "../@modules/stores/auth";

import EditIngredientDialog from "./Dialogs/EditIngredientDialog";
import IconPickerDialog from "./Dialogs/IconPickerDialog";
import ImportRecipeDialog from "./Dialogs/ImportRecipeDialog";
import RecipeSelectorDialog from "./Dialogs/RecipeSelectorDialog";
import TextInputDialog from "./Dialogs/TextInputDialog";
import Loading from "./Loading";

export default function Shell() {
  const { loading: userLoading, user } = useRecoilValue(authStore);

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    if (!userLoading && !user && !location.pathname.includes("/public/")) {
      router.navigate("/login");
    }
  }, [userLoading, user]);

  if (!user && userLoading) {
    return <Loading />;
  }

  return (
    <>
      <RouterProvider router={router} />
      <RecipeSelectorDialog />
      <EditIngredientDialog />
      <ImportRecipeDialog />
      <TextInputDialog />
      <IconPickerDialog />
    </>
  );
}
