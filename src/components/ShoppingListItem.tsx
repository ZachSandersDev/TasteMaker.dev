import { useNavigate } from "react-router-dom";
import sanitize from "sanitize-html";

import { ShoppingList } from "../@modules/types/shoppingLists";

export type ShoppingListItemProps = {
  shoppingList: ShoppingList;
};

export const ShoppingListItem = ({ shoppingList }: ShoppingListItemProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/shopping-list/${shoppingList._id}`);
  };

  return (
    <div className="ra-option" onClick={handleClick}>
      <span className="ra-option-icon">🗒️</span>
      <span
        dangerouslySetInnerHTML={{
          __html: sanitize(shoppingList.name) || "Untitled List",
        }}
      ></span>
    </div>
  );
};
