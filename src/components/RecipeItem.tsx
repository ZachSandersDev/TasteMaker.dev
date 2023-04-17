import sanitize from "sanitize-html";

import { useRecipe } from "../@modules/stores/recipes";

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
    <div className="ra-option" onClick={handleClick}>
      <span className="ra-option-icon">{recipe.icon || "🗒️"}</span>
      <span
        dangerouslySetInnerHTML={{
          __html: sanitize(recipe.name) || "Untitled Recipe",
        }}
      ></span>
    </div>
  );
};
