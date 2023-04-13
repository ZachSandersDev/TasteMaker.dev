import { useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import { recipeStore } from "../../@modules/stores/recipes";
import { treeStore } from "../../@modules/stores/tree";

import { Recipe } from "../../@modules/types/recipes";
import RecipeTree from "../RecipeTree/RecipeTree";

import "./RecipeSelectorDialog.scss";

const recipeSelectorDialog = atom<{
  resolve?: (r?: Recipe) => void;
  reject?: (e: Error) => void;
}>({
  key: "recipeSelectorDialog",
  default: {},
});

export function selectRecipe() {
  return new Promise<Recipe | undefined>((resolve, reject) => {
    setRecoil(recipeSelectorDialog, { resolve, reject });
  });
}

export default function RecipeSelectorDialog() {
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const { tree } = useRecoilValue(treeStore);
  const { recipes } = useRecoilValue(recipeStore);
  const [{ resolve, reject }, setDialogState] =
    useRecoilState(recipeSelectorDialog);

  const res = (r?: Recipe) => {
    if (resolve) {
      resolve(r);
      setDialogState({});
    }
  };

  const handleClick = (id: string | number, isRecipe: boolean) => {
    if (isRecipe) {
      return res(recipes.find((r) => r._id === String(id)));
    }

    setFolderStack([...folderStack, String(id)]);
  };

  const currentFolder = tree.find((f) => String(f.id) === folderStack.at(-1));

  if (!resolve || !reject) {
    return null;
  }

  return (
    <>
      <div className="ra-dialog ra-card recipe-selector-dialog">
        <header
          className="ra-header"
          style={{ justifyContent: "flex-start", gap: "var(--spacing)" }}
        >
          {currentFolder && (
            <button
              className="material-symbols-rounded icon-button"
              onClick={() => setFolderStack((f) => f.slice(0, f.length - 1))}
            >
              chevron_left
            </button>
          )}
          <h3>{currentFolder ? currentFolder.text : "Select Recipe"}</h3>
        </header>

        <div className="ra-list">
          <RecipeTree folderId={folderStack.at(-1)} onClick={handleClick} />
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={() => res(undefined)}></div>
    </>
  );
}
