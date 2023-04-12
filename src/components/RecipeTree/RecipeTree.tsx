import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { treeStore } from "../../@modules/stores/tree";

import { RecipeItem } from "../RecipeItem";
import SwipeToDelete from "../SwipeToDelete";

import { FolderItem } from "./FolderItem";

import "./RecipeTree.scss";

export interface RecipeTreeProps {
  folderId?: string | number,
  onFolderDelete: (id: string | number) => void
}

export default function RecipeTree({folderId, onFolderDelete}: RecipeTreeProps) {
  const navigate = useNavigate();
  const { tree } = useRecoilValue(treeStore);

  const handleNavigate = (id: string | number | undefined, isRecipe: boolean) => {
    console.log({id, isRecipe});
    if(id === undefined) throw new Error("No ID passed to handleNavigate");

    if(isRecipe) {
      navigate(`/recipe/${id}`);
    } else {
      navigate(`/folder/${id}`);
    }
  };

  if (!tree.length) {
    return <span style={{ alignSelf: "center" }}>No recipes found yet!</span>;
  }

  return (
    <div className="recipe-tree">
      {tree
        .filter(n => folderId !== undefined ? n.parent === folderId : n.parent === -1)
        .map(node => 
          node.data ? 
            <RecipeItem
              key={node.id}
              recipeId={node.data}
              onClick={() => handleNavigate(node.data, true)}
            />
            : 
            <SwipeToDelete
              key={node.id}
              onDelete={() => onFolderDelete(node.id)}
            >
              <FolderItem
                node={node}
                onClick={() => handleNavigate(node.id, false)}
              />
            </SwipeToDelete>
        )}
    </div>
  );
}
