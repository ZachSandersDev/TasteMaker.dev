import { createBrowserRouter } from "react-router-dom";

import MyRecipes from "../views/Home";
import RecipeView from "../views/RecipeView";
import ShoppingListView from "../views/ShoppingListView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyRecipes />,
  },
  {
    path: "/recipe/:treeNodeId/:recipeId",
    element: <RecipeView />,
  },
  {
    path: "/shopping-list/:listId",
    element: <ShoppingListView />,
  },
]);

export default router;
