import sanitize from "sanitize-html";

import { useRecipe } from "../@modules/stores/recipes";
import classNames from "../@modules/utils/classNames";

export type RecipeItemProps = {
  onClick?: (e: React.MouseEvent) => void;
  recipeId: string;
  disabled?: boolean;
};

export const RecipeItem = ({
  onClick,
  recipeId,
  disabled,
}: RecipeItemProps) => {
  const recipe = useRecipe(recipeId);

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
      <span className="ra-option-icon">{recipe.icon || "🗒️"}</span>
      <span
        dangerouslySetInnerHTML={{
          __html: sanitize(recipe.name) || "Untitled Recipe",
        }}
      ></span>
    </div>
  );
};
