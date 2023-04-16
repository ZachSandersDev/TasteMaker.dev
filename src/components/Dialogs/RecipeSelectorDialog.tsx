import { useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import { recipeStore } from "../../@modules/stores/recipes";
import { treeStore } from "../../@modules/stores/tree";

import { Recipe } from "../../@modules/types/recipes";
import RecipeTree from "../RecipeTree/RecipeTree";

import "./RecipeSelectorDialog.scss";

const recipeSelectorDialog = atom<{
  resolve?: (r?: Recipe | string) => void;
  reject?: (e: Error) => void;
  folderOnly?: boolean;
}>({
  key: "recipeSelectorDialog",
  default: {},
});

export function selectRecipe() {
  return new Promise<Recipe | undefined>((resolve, reject) => {
    // @ts-expect-error Since this can return a recipe or a folder id
    setRecoil(recipeSelectorDialog, { resolve, reject, folderOnly: false });
  });
}

export function selectFolder() {
  return new Promise<string | undefined>((resolve, reject) => {
    // @ts-expect-error Since this can return a recipe or a folder id
    setRecoil(recipeSelectorDialog, { resolve, reject, folderOnly: true });
  });
}

export default function RecipeSelectorDialog() {
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const { tree } = useRecoilValue(treeStore);
  const { recipes } = useRecoilValue(recipeStore);
  const [{ resolve, reject, folderOnly }, setDialogState] =
    useRecoilState(recipeSelectorDialog);

  const res = (r?: Recipe | string) => {
    if (resolve) {
      resolve(r);
    }
    setDialogState({});
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
          <h3>
            {currentFolder
              ? currentFolder.text
              : folderOnly
              ? "Select Folder"
              : "Select Recipe"}
          </h3>
        </header>

        <div className="ra-list">
          <RecipeTree
            folderOnly={folderOnly}
            folderId={folderStack.at(-1)}
            onClick={handleClick}
          />
        </div>

        <div className="ra-actions">
          <button
            className="chip-button"
            onClick={() => res(String(currentFolder?.id || -1))}
          >
            Select this folder
          </button>
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={() => res(undefined)}></div>
    </>
  );
}
