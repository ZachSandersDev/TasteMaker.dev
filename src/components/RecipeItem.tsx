import sanitize from "sanitize-html";

import { useRecipe } from "../@modules/stores/recipes";

import "./RecipeItem.scss";

export type RecipeItemProps = {
  onClick?: (e: React.MouseEvent) => void;
  recipeId: string;
};

export const RecipeItem = ({ onClick, recipeId }: RecipeItemProps) => {
  const recipe = useRecipe(recipeId);

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick(e);
  };

  if (!recipe) {
    return null;
  }

  return (
    <div className="recipe-item" onClick={handleClick}>
      <span className="recipe-item-icon">{recipe.icon}</span>
      <span
        dangerouslySetInnerHTML={{
          __html: sanitize(recipe.name) || "Untitled Recipe",
        }}
      ></span>
    </div>
  );
};
