import { createBrowserRouter } from "react-router-dom";

import Home from "../views/RecipesView";
import LoginView from "../views/Login";
import RecipeView from "../views/RecipeView";
import { ShoppingListView } from "../views/ShoppingList";
import RootView from "../views/RootView";
import ShoppingListsView from "../views/ShoppingLists";
import RecipesView from "../views/RecipesView";
import ProfileView from "../views/ProfileView";

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
        element: <RecipeView />,
      },
      {
        path: "shopping-lists",
        element: <ShoppingListsView />,
      },
      {
        path: "shopping-list/:listId",
        element: <ShoppingListView />,
      },
      {
        path: "profile",
        element: <ProfileView />,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginView />,
  },
]);

export default router;
