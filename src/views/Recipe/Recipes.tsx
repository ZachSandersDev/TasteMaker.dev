import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { newRecipe } from "../../@modules/api/recipes";
import { saveTree } from "../../@modules/api/tree";
import { treeStore } from "../../@modules/stores/tree";
import { setRecipeDefaults } from "../../@modules/types/recipes";

import AppHeader from "../../components/AppHeader";
import RecipeTree from "../../components/RecipeTree/RecipeTree";

export default function RecipesView() {
  const { tree } = useRecoilValue(treeStore);

  const makeNewRecipe = async () => {
    const id = await newRecipe(setRecipeDefaults({}));
    if (!id) return;

    saveTree([
      ...tree,
      {
        id: uuid(),
        parent: -1,
        text: "",
        data: id,
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
        <div className="ra-actions">
          <button className="icon-button material-symbols-rounded" onClick={makeNewFolder}>
            create_new_folder
          </button>
          <button className="icon-button material-symbols-rounded" onClick={makeNewRecipe}>
            add
          </button>
        </div>
      </AppHeader>

      <h2 className="ra-title">My Recipes</h2>
      
      <RecipeTree />
    </div>
  );
}
