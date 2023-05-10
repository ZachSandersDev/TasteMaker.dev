import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import { RecipeSelectorDialogAtom } from "../../@modules/stores/dialogs";
import { folderStore } from "../../@modules/stores/folders";
import { recipeStore } from "../../@modules/stores/recipes";

import { Folder } from "../../@modules/types/folder";
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

export function selectFolder(disablePathUnder?: string) {
  return new Promise<string | undefined>((resolve, reject) => {
    setRecoil(RecipeSelectorDialogAtom, {
      // @ts-expect-error Resolve could resolve recipe or string
      resolve,
      reject,
      payload: { folderOnly: true, disablePathUnder },
    });
  });
}

export default function RecipeSelectorDialog() {
  const [folderStack, setFolderStack] = useState<string[]>([]);
  const { folders } = useRecoilValue(folderStore);
  const { recipes } = useRecoilValue(recipeStore);
  const [
    {
      resolve,
      reject,
      payload: { folderOnly = false, disablePathUnder = undefined } = {},
    },
    setDialogState,
  ] = useRecoilState(RecipeSelectorDialogAtom);

  const res = (r?: Recipe | string) => {
    if (resolve) {
      resolve(r);
    }
    setDialogState({});
  };

  const handleRecipeClick = (recipe: Recipe) => {
    res(recipe);
  };

  const handleFolderClick = (folder: Folder) => {
    setFolderStack([...folderStack, String(folder._id)]);
  };

  const currentFolder = folders.find((f) => f._id === folderStack.at(-1));

  useEffect(() => {
    if (!resolve || !reject) {
      setFolderStack([]);
    }
  }, [resolve, reject]);

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
              arrow_back_ios_new
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
            folderId={currentFolder?._id}
            disablePathUnder={disablePathUnder}
            onRecipeClick={handleRecipeClick}
            onFolderClick={handleFolderClick}
          />
        </div>

        {folderOnly && (
          <div className="ra-actions">
            <Button
              onClick={() => res(String(currentFolder?._id || -1))}
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
