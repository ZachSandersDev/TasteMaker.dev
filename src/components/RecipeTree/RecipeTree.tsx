import { useRecoilValue } from "recoil";

import { folderStore } from "../../@modules/stores/folders";
import { recipeStore } from "../../@modules/stores/recipes";

import { RecipeItem } from "../RecipeItem";

import { FolderItem } from "./FolderItem";

export interface RecipeTreeProps {
  folderId?: string | number;
  folderOnly?: boolean;
  disablePathUnder?: string;
  onClick: (id: string | number, isRecipe: boolean) => void;
}

export default function RecipeTree({
  folderId,
  folderOnly,
  disablePathUnder,
  onClick,
}: RecipeTreeProps) {
  const { folders } = useRecoilValue(folderStore);
  const { recipes } = useRecoilValue(recipeStore);

  if (!folders.length && !recipes.length) {
    return <span style={{ alignSelf: "center" }}>No recipes yet!</span>;
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
            onClick={() => onClick(folder._id, false)}
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
            onClick={() => onClick(recipe._id || "", true)}
            disabled={folderOnly}
          />
        ))}
    </div>
  );
}
