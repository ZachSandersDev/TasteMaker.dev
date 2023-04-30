import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import { RecipeSelectorDialogAtom } from "../../@modules/stores/dialogs";
import { recipeStore } from "../../@modules/stores/recipes";
import { treeStore } from "../../@modules/stores/tree";

import { Recipe } from "../../@modules/types/recipes";
import RecipeTree from "../RecipeTree/RecipeTree";

import "./RecipeSelectorDialog.scss";

export function selectRecipe() {
  return new Promise<Recipe | undefined>((resolve, reject) => {
    setRecoil(RecipeSelectorDialogAtom, {
      // @ts-expect-error Resolve could resolve recipe or string
      resolve,
      reject,
      payload: { folderOnly: false },
    });
  });
}

export function selectFolder() {
  return new Promise<string | undefined>((resolve, reject) => {
    setRecoil(RecipeSelectorDialogAtom, {
      // @ts-expect-error Resolve could resolve recipe or string
      resolve,
      reject,
      payload: { folderOnly: true },
    });
  });
}

export default function RecipeSelectorDialog() {
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const { tree } = useRecoilValue(treeStore);
  const { recipes } = useRecoilValue(recipeStore);
  const [
    { resolve, reject, payload: { folderOnly = false } = {} },
    setDialogState,
  ] = useRecoilState(RecipeSelectorDialogAtom);

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
          className="ra-card-header"
          style={{ justifyContent: "flex-start", gap: "var(--spacing)" }}
        >
          {currentFolder && (
            <Button
              onClick={() => setFolderStack((f) => f.slice(0, f.length - 1))}
              variant="icon"
            >
              chevron_left
            </Button>
          )}
          <h3>
            {currentFolder && currentFolder.text}
            {!currentFolder && folderOnly && "Select Folder"}
            {!currentFolder && !folderOnly && "Select Recipe"}
          </h3>
        </header>

        <div className="ra-list">
          <RecipeTree
            folderOnly={folderOnly}
            folderId={currentFolder?.id}
            onClick={handleClick}
          />
        </div>

        {folderOnly && (
          <div className="ra-actions">
            <Button
              onClick={() => res(String(currentFolder?.id || -1))}
              size="sm"
            >
              Select this folder
            </Button>
          </div>
        )}
      </div>
      <div className="ra-dialog-cover" onClick={() => res(undefined)}></div>
    </>
  );
}
