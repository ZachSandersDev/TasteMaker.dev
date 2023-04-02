import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { setRecipeDefaults } from "../@modules/types/recipes";
import { newRecipe } from "../@modules/api/recipes";
import { treeStore } from "../@modules/stores/tree";

import AppHeader from "../components/AppHeader";
import RecipeTree from "../components/RecipeTree/RecipeTree";
import { saveTree } from "../@modules/api/tree";

import { newList } from "../@modules/api/shoppingLists";
import { listStore } from "../@modules/stores/shoppingLists";
import { ShoppingListItem } from "../components/ShoppingListItem";

export default function Home() {
  const { tree } = useRecoilValue(treeStore);
  const { lists, loading: listsLoading } = useRecoilValue(listStore);

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

  const makeNewShoppingList = async () => {
    await newList({
      _id: "",
      name: "Untitled Shopping List",
      recipeIds: [],
      ingredients: [],
    });
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
    <>
      <AppHeader>
        <h1 className="app-title">Recipe Awesome</h1>
      </AppHeader>
      <div className="ra-view home-view">
        <header className="ra-header">
          <h3>My Recipes</h3>
          <div className="ra-actions">
            <button className="chip-button" onClick={makeNewFolder}>
              <i className="material-symbols-rounded">create_new_folder</i>
              New Folder
            </button>
            <button className="chip-button" onClick={makeNewRecipe}>
              <i className=" material-symbols-rounded">note_add</i>
              New Recipe
            </button>
          </div>
        </header>

        <RecipeTree />

        <header className="ra-header">
          <h3>Shopping Lists</h3>
          <div className="ra-actions">
            <button className="chip-button" onClick={makeNewShoppingList}>
              <i className=" material-symbols-rounded">note_add</i>
              New List
            </button>
          </div>
        </header>

        {lists.length ? (
          <div className="ra-list">
            {lists.map((l) => (
              <ShoppingListItem key={l._id} shoppingList={l} />
            ))}
          </div>
        ) : (
          <span>No shopping lists yet!</span>
        )}
      </div>
    </>
  );
}
