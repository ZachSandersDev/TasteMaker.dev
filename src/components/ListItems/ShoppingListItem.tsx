import { useNavigate } from "react-router-dom";

import Button from "../../@design/components/Button/Button";
import { ShoppingList } from "../../@modules/types/shoppingLists";

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
    <Button
      className="list-option"
      gap="calc(var(--spacing) * 1.5)"
      variant="naked"
      onClick={handleClick}
      iconBefore="notes"
    >
      {shoppingList.name || "Untitled Shopping List"}
    </Button>
  );
};
