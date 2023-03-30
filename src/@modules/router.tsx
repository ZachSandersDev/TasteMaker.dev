import { createBrowserRouter } from "react-router-dom";

import MyRecipes from "../views/MyRecipes";
import RecipeView from "../views/RecipeView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MyRecipes />,
  },
  {
    path: "/recipe/:treeNodeId/:recipeId",
    element: <RecipeView />,
  },
]);

export default router;
