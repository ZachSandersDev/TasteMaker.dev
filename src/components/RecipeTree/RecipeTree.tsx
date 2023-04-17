import { useRecoilValue } from "recoil";

import { recipeStore } from "../../@modules/stores/recipes";

import { treeStore } from "../../@modules/stores/tree";

import { RecipeItem } from "../RecipeItem";
import SwipeToDelete from "../SwipeToDelete";

import { FolderItem } from "./FolderItem";

export interface RecipeTreeProps {
  folderId?: string | number;
  folderOnly?: boolean;
  onClick: (id: string | number, isRecipe: boolean) => void;
  onFolderDelete?: (id: string | number) => void;
}

export default function RecipeTree({
  folderId,
  folderOnly,
  onFolderDelete,
  onClick,
}: RecipeTreeProps) {
  const { tree } = useRecoilValue(treeStore);
  const { recipes } = useRecoilValue(recipeStore);

  if (!tree.length) {
    return <span style={{ alignSelf: "center" }}>No recipes found yet!</span>;
  }

  return (
    <div className="ra-option-list">
      {tree
        .filter(
          (n) =>
            (folderId !== undefined
              ? n.parent === folderId
              : n.parent === -1) &&
            (!folderOnly || !n.data)
        )
        .sort((a, b) => {
          if (a.data && !b.data) {
            return 1;
          }
          if (!a.data && b.data) {
            return -1;
          }
          if (!a.data && !b.data) {
            return a.text.localeCompare(b.text);
          }

          const ra = recipes.find((r) => r._id === a.data);
          const rb = recipes.find((r) => r._id === b.data);

          if (ra && rb) {
            return ra.name.localeCompare(rb.name);
          }

          return 1;
        })
        .map((node) =>
          node.data ? (
            <RecipeItem
              key={node.id}
              recipeId={node.data}
              onClick={() => onClick(node.data || "", true)}
            />
          ) : onFolderDelete ? (
            <SwipeToDelete
              key={node.id}
              onDelete={() => onFolderDelete(node.id)}
            >
              <FolderItem node={node} onClick={() => onClick(node.id, false)} />
            </SwipeToDelete>
          ) : (
            <FolderItem
              key={node.id}
              node={node}
              onClick={() => onClick(node.id, false)}
            />
          )
        )}
    </div>
  );
}
