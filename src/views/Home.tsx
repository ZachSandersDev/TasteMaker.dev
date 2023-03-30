import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { setRecipeDefaults } from "../@modules/types/recipes";
import { newRecipe } from "../@modules/api/recipes";
import { recipeStore } from "../@modules/stores/recipes";
import { treeStore } from "../@modules/stores/tree";

import AppHeader from "../components/AppHeader";
import RecipeTree from "../components/RecipeTree/RecipeTree";
import { saveTree } from "../@modules/api/tree";

import "./Home.scss";
import { newList } from "../@modules/api/shoppingLists";
import { listStore } from "../@modules/stores/shoppingLists";
import { ShoppingListItem } from "../components/ShoppingListItem";

export default function Home() {
  const { loading: recipesLoading } = useRecoilValue(recipeStore);
  const { tree, loading: treeLoading } = useRecoilValue(treeStore);
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
        data: {
          icon: "🗒️",
          recipeId: id,
        },
      },
    ]);
  };

  const makeNewShoppingList = async () => {
    await newList({
      _id: "",
      name: "Untitled Shopping List",
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
    <div className="ra-view home-view">
      <AppHeader>
        <h1>Recipe Awesome</h1>
      </AppHeader>

      <div className="home-card">
        <header className="home-card-header">
          <h3>My Recipes</h3>
          <header className="home-card-header">
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
        </header>

        {!treeLoading && !recipesLoading ? (
          <RecipeTree />
        ) : (
          <span>Loading...</span>
        )}
      </div>

      <div className="home-card">
        <header className="home-card-header">
          <h3>Shopping Lists</h3>
          <header className="home-card-header">
            <button
              className="icon-button material-symbols-rounded"
              onClick={makeNewShoppingList}
            >
              note_add
            </button>
          </header>
        </header>

        {listsLoading ? (
          <span>Loading...</span>
        ) : lists.length ? (
          lists.map((l) => <ShoppingListItem key={l._id} shoppingList={l} />)
        ) : (
          <span>No shopping lists yet!</span>
        )}
      </div>
    </div>
  );
}
