import { useEffect } from "react";
import { useRecoilValue } from "recoil";

import { setRecipeDefaults } from "../@modules/types/recipes";
import { newRecipe } from "../@modules/api/recipes";
import { listenForRecipes, recipeStore } from "../@modules/stores/recipes";
import { listenForTree, treeStore } from "../@modules/stores/tree";

import AppHeader from "../components/AppHeader";
import RecipeTree from "../components/RecipeTree/RecipeTree";
import { saveTree } from "../@modules/api/tree";

import "./MyRecipes.scss";

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
        <header className="my-recipes-card-header">
          <button
            className="icon-button material-symbols-rounded"
            onClick={makeNewRecipe}
          >
            create_new_folder
          </button>
          <button
            className="icon-button material-symbols-rounded"
            onClick={makeNewFolder}
          >
            note_add
          </button>
        </header>
      </AppHeader>

      <div className="my-recipes-card">
        {tree.length && recipes.length ? (
          <RecipeTree />
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
}
