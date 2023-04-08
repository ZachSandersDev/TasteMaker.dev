import { createBrowserRouter } from "react-router-dom";

import LoginView from "../views/Login";
import ProfileView from "../views/ProfileView";
import RecipeDetailsView from "../views/Recipe/RecipeDetails";
import RecipesView from "../views/Recipe/Recipes";
import RootView from "../views/RootView";
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
