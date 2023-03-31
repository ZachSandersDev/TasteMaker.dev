import { createBrowserRouter } from "react-router-dom";

import Home from "../views/Home";
import LoginView from "../views/Login";
import RecipeView from "../views/RecipeView";
import { ShoppingListView } from "../views/ShoppingList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <LoginView />,
  },
  {
    path: "/recipe/:recipeId",
    element: <RecipeView />,
  },
  {
    path: "/shopping-list/:listId",
    element: <ShoppingListView />,
  },
]);

export default router;
