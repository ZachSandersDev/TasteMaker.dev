import { useRecoilValue } from "recoil";

import Button from "../../@design/components/Button/Button";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { newList } from "../../@modules/api/shoppingLists";
import { listStore } from "../../@modules/stores/shoppingLists";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import { ShoppingListItem } from "../../components/ShoppingListItem";

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
    <AppView
      header={
        <AppHeader>
          <div className="ra-actions">
            <Button
              onClick={makeNewShoppingList}
              variant="icon"
              iconBefore="add"
            />
          </div>
        </AppHeader>
      }
    >
      <header className="ra-header">
        <MultilineInput
          className="ra-title"
          value="Shopping Lists"
          variant="naked"
          disabled
        />
      </header>

      {lists.length ? (
        <div className="ra-option-list">
          {lists.map((l) => (
            <ShoppingListItem key={l._id} shoppingList={l} />
          ))}
        </div>
      ) : (
        <span>No shopping lists yet!</span>
      )}
    </AppView>
  );
}
