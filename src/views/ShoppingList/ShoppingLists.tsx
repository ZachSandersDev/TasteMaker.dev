import Button from "../../@design/components/Button/Button";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import { newList } from "../../@modules/api/shoppingLists";

import { useShoppingLists } from "../../@modules/hooks/shoppingLists";
import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import { ShoppingListItem } from "../../components/ShoppingListItem";

export default function ShoppingListsView() {
  const { shoppingLists } = useShoppingLists();

  const makeNewShoppingList = async () => {
    await newList({
      _id: "",
      name: "Untitled Shopping List",
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

      <div className="ra-option-list">
        {shoppingLists?.length ? (
          shoppingLists?.map((l) => (
            <ShoppingListItem key={l._id} shoppingList={l} />
          ))
        ) : (
          <span className="ra-option">No shopping lists yet!</span>
        )}
      </div>
    </AppView>
  );
}
