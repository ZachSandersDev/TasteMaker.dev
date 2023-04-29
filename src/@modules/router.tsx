import { createBrowserRouter } from "react-router-dom";

import LoginView from "../views/Login";
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
]);

export default router;
