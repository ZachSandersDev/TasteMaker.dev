import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";

import { setRecipeDefaults } from "../@modules/types/recipes";
import { newRecipe } from "../@modules/api/recipes";
import { listenForRecipes, recipeStore } from "../@modules/stores/recipes";
import { listenForTree, treeStore } from "../@modules/stores/tree";

import AppHeader from "../components/AppHeader";
import RecipeTree from "../components/RecipeTree/RecipeTree";
import { saveTree } from "../@modules/api/tree";

export default function MyRecipes() {
  const { recipes } = useRecoilValue(recipeStore);
  const { tree } = useRecoilValue(treeStore);

  useEffect(() => {
    listenForRecipes();
    listenForTree();
  }, []);

  const makeNewRecipe = async () => {
    const id = await newRecipe(setRecipeDefaults({}));
    if (!id) return;

    saveTree([
      ...tree,
      {
        id: crypto.randomUUID(),
        parent: -1,
        text: "",
        data: {
          icon: "🗒️",
          recipeId: id,
        },
      },
    ]);
  };

  const makeNewFolder = async () => {
    saveTree([
      ...tree,
      {
        id: crypto.randomUUID(),
        parent: -1,
        text: "New Folder",
      },
    ]);
  };

  return (
    <div className="ra-view">
      <AppHeader>
        <h2>My Recipes</h2>
      </AppHeader>

      {tree.length && recipes.length ? <RecipeTree /> : <span>Loading...</span>}

      <button onClick={makeNewRecipe}>New Recipe</button>
      <button onClick={makeNewFolder}>New Folder</button>
    </div>
  );
}
