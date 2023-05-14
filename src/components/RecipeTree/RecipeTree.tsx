import { useRecoilValue } from "recoil";

import { folderStore } from "../../@modules/stores/folders";
import { recipeStore } from "../../@modules/stores/recipes";
import { Folder } from "../../@modules/types/folder";
import { Recipe } from "../../@modules/types/recipes";

import { RecipeItem } from "../RecipeItem";

import { FolderItem } from "./FolderItem";

export interface RecipeTreeProps {
  folderId?: string;
  folderOnly?: boolean;
  disablePathUnder?: string;
  onRecipeClick: (recipe: Recipe) => void;
  onFolderClick: (folder: Folder) => void;
}

export default function RecipeTree({
  folderId,
  folderOnly,
  disablePathUnder,
  onRecipeClick,
  onFolderClick,
}: RecipeTreeProps) {
  const { folders } = useRecoilValue(folderStore);
  const { recipes } = useRecoilValue(recipeStore);

  if (!folders.length && !recipes.length) {
    return <span>No recipes yet!</span>;
  }

  return (
    <div className="ra-option-list">
      {folders
        .filter(
          (n) =>
            (disablePathUnder === undefined || n._id !== disablePathUnder) &&
            (folderId !== undefined ? n.parent === folderId : !n.parent)
        )
        .sort((a, b) => {
          const aText = a.text || "Untitled Folder";
          const bText = b.text || "Untitled Folder";
          return aText.localeCompare(bText);
        })
        .map((folder) => (
          <FolderItem
            key={folder._id}
            folder={folder}
            onClick={() => onFolderClick(folder)}
          />
        ))}

      {recipes
        .filter((n) =>
          folderId !== undefined ? n.parent === folderId : !n.parent
        )
        .sort((a, b) => {
          const aText = a.name || "Untitled Recipe";
          const bText = b.name || "Untitled Recipe";
          return aText.localeCompare(bText);
        })
        .map((recipe) => (
          <RecipeItem
            key={recipe._id}
            recipe={recipe}
            onClick={() => onRecipeClick(recipe)}
            disabled={folderOnly}
          />
        ))}
    </div>
  );
}
