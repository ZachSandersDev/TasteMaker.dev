import { useNavigate } from "react-router-dom";

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
      <span style={{ whiteSpace: "pre-wrap" }}>
        {shoppingList.name || "Untitled List"}
      </span>
    </div>
  );
};
