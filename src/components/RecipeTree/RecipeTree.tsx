import { useRecoilValue } from "recoil";

import { treeStore } from "../../@modules/stores/tree";

import { RecipeItem } from "../RecipeItem";
import SwipeToDelete from "../SwipeToDelete";

import { FolderItem } from "./FolderItem";

import "./RecipeTree.scss";

export interface RecipeTreeProps {
  folderId?: string | number;
  onClick: (id: string | number, isRecipe: boolean) => void;
  onFolderDelete?: (id: string | number) => void;
}

export default function RecipeTree({
  folderId,
  onFolderDelete,
  onClick,
}: RecipeTreeProps) {
  const { tree } = useRecoilValue(treeStore);

  if (!tree.length) {
    return <span style={{ alignSelf: "center" }}>No recipes found yet!</span>;
  }

  return (
    <div className="recipe-tree">
      {tree
        .filter((n) =>
          folderId !== undefined ? n.parent === folderId : n.parent === -1
        )
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
