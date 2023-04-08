import { useRecoilValue } from "recoil";

import { newList } from "../@modules/api/shoppingLists";
import { listStore } from "../@modules/stores/shoppingLists";
import { ShoppingListItem } from "../components/ShoppingListItem";
import AppHeader from "../components/AppHeader";

export default function ShoppingListsView() {
  const { lists } = useRecoilValue(listStore);

  const makeNewShoppingList = async () => {
    await newList({
      _id: "",
      name: "Untitled Shopping List",
      recipeIds: [],
      ingredients: [],
    });
  };

  return (
    <div className="ra-view">
      <AppHeader>
        <div className="ra-actions">
          <button className="icon-button material-symbols-rounded" onClick={makeNewShoppingList}>
            add
          </button>
        </div>
      </AppHeader>

      <h2 className="ra-title">Shopping Lists</h2>

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
  );
}
