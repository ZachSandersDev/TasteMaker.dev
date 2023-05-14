import React, { Suspense } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

import Loading from "../components/Loading";
import LoginView from "../views/Login";
import RootView from "../views/RootView";

const PublicRecipeView = React.lazy(() => import("../views/PublicRecipeView"));
const RecipeDetailsView = React.lazy(
  () => import("../views/Recipe/Details/RecipeDetails")
);
const RecipesView = React.lazy(() => import("../views/Recipe/Recipes"));
const SettingsView = React.lazy(() => import("../views/Settings/SettingsView"));
const ShoppingListDetailsView = React.lazy(
  () => import("../views/ShoppingList/ShoppingListDetails")
);
const ShoppingListsView = React.lazy(
  () => import("../views/ShoppingList/ShoppingLists")
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootView />,
    children: [
      {
        path: "",
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <RecipesView />
          </Suspense>
        ),
      },
      {
        path: "recipe/:recipeId",
        element: (
          <Suspense fallback={<Loading />}>
            <RecipeDetailsView />
          </Suspense>
        ),
      },
      {
        path: "shopping-lists",
        element: (
          <Suspense fallback={<Loading />}>
            <ShoppingListsView />
          </Suspense>
        ),
      },
      {
        path: "shopping-list/:listId",
        element: (
          <Suspense fallback={<Loading />}>
            <ShoppingListDetailsView />
          </Suspense>
        ),
      },
      {
        path: "settings",
        element: (
          <Suspense fallback={<Loading />}>
            <SettingsView />
          </Suspense>
        ),
      },
      {
        path: "/folder/:folderId",
        element: (
          <Suspense fallback={<Loading />}>
            <RecipesView />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/public/:userId/recipe/:recipeId",
    element: (
      <Suspense fallback={<Loading />}>
        <PublicRecipeView />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);

export default router;
