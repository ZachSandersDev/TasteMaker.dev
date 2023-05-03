import { Recipe } from "../@modules/types/recipes";
import classNames from "../@modules/utils/classNames";

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
    <div
      className={classNames("ra-option", disabled && "disabled")}
      onClick={handleClick}
    >
      <span className="ra-option-icon">
        {recipe.iconImage ? (
          <img src={recipe.iconImage.imageUrl} />
        ) : (
          recipe.icon || "🗒️"
        )}
      </span>
      <span>{recipe.name || "Untitled Recipe"}</span>
    </div>
  );
};
