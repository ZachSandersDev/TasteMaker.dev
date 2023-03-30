import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { authStore, listenForAuth } from "../@modules/stores/auth";
import { listenForRecipes } from "../@modules/stores/recipes";
import { listenForTree } from "../@modules/stores/tree";

import router from "../@modules/router";

export default function Shell() {
  const { user } = useRecoilValue(authStore);

  useEffect(() => {
    listenForAuth();
  }, []);

  useEffect(() => {
    if (user) {
      listenForRecipes();
      listenForTree();
    }
  }, [user]);

  return user ? (
    <main>
      <RouterProvider router={router} />
    </main>
  ) : (
    <span>Loading...</span>
  );
}
