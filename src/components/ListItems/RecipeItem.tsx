import Button from "../../@design/components/Button/Button";
import { Recipe } from "../../@modules/types/recipes";

import "./ListItem.scss";

export type RecipeItemProps = {
  onClick?: (e: React.MouseEvent) => void;
  recipe: Recipe;
  disabled?: boolean;
};

export const RecipeItem = ({ onClick, recipe, disabled }: RecipeItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !disabled) onClick(e);
  };

  if (!recipe) {
    return null;
  }

  return (
    <Button
      className="list-option"
      gap="calc(var(--spacing) * 1.5)"
      variant="naked"
      onClick={handleClick}
      disabled={disabled}
      before={
        recipe.iconImage ? (
          <img src={recipe.iconImage.imageUrl} />
        ) : (
          recipe.icon || <i className="material-symbols-rounded">notes</i>
        )
      }
    >
      {recipe.name || "Untitled Recipe"}
    </Button>
  );
};
