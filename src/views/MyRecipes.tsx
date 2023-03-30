import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { setRecipeDefaults } from "../@modules/types/recipes";
import { newRecipe } from "../@modules/api/recipes";
import { recipeStore } from "../@modules/stores/recipes";
import { treeStore } from "../@modules/stores/tree";

import AppHeader from "../components/AppHeader";
import RecipeTree from "../components/RecipeTree/RecipeTree";
import { saveTree } from "../@modules/api/tree";

import "./MyRecipes.scss";

export default function MyRecipes() {
  const { loading: recipesLoading } = useRecoilValue(recipeStore);
  const { tree, loading: treeLoading } = useRecoilValue(treeStore);

  const makeNewRecipe = async () => {
    const id = await newRecipe(setRecipeDefaults({}));
    if (!id) return;

    saveTree([
      ...tree,
      {
        id: uuid(),
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
        id: uuid(),
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
            onClick={makeNewFolder}
          >
            create_new_folder
          </button>
          <button
            className="icon-button material-symbols-rounded"
            onClick={makeNewRecipe}
          >
            note_add
          </button>
        </header>
      </AppHeader>

      <div className="my-recipes-card">
        {!treeLoading && !recipesLoading ? (
          <RecipeTree />
        ) : (
          <span>Loading...</span>
        )}
      </div>
    </div>
  );
}
