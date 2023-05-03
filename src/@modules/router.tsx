import { Navigate, createBrowserRouter } from "react-router-dom";

import LoginView from "../views/Login";
import PublicRecipeView from "../views/PublicRecipeView";
import RecipeDetailsView from "../views/Recipe/Details/RecipeDetails";
import RecipesView from "../views/Recipe/Recipes";
import RootView from "../views/RootView";
import SettingsView from "../views/SettingsView";
import ShoppingListDetailsView from "../views/ShoppingList/ShoppingListDetails";
import ShoppingListsView from "../views/ShoppingList/ShoppingLists";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootView />,
    children: [
      {
        path: "",
        index: true,
        element: <RecipesView />,
      },
      {
        path: "recipe/:recipeId",
        element: <RecipeDetailsView />,
      },
      {
        path: "shopping-lists",
        element: <ShoppingListsView />,
      },
      {
        path: "shopping-list/:listId",
        element: <ShoppingListDetailsView />,
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
      {
        path: "/folder/:folderId",
        element: <RecipesView />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/public/:userId/recipe/:recipeId",
    element: <PublicRecipeView />,
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);

export default router;
