import { useNavigate } from "react-router-dom";

import { ShoppingList } from "../@modules/types/shoppingLists";

import "./RecipeTree/RecipeTreeNode.scss";

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
    <div className="recipe-tree-node" onClick={handleClick}>
      <span className="recipe-tree-node-icon">🗒️</span>

      <span>{shoppingList.name}</span>
    </div>
  );
};
