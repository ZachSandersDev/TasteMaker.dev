import { Fragment, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import { getFolder, getFoldersWithParent } from "../../@modules/api/folders";
import { getRecipesWithParent } from "../../@modules/api/recipes";
import { useAllWorkspaces } from "../../@modules/hooks/useAllWorkspaces";
import { authStore } from "../../@modules/stores/auth";
import { RecipeSelectorDialogAtom } from "../../@modules/stores/dialogs";

import { profileStore } from "../../@modules/stores/profile";
import { Folder } from "../../@modules/types/folder";
import { Recipe } from "../../@modules/types/recipes";
import { useSWR } from "../../@modules/utils/cache.react";

import "./RecipeSelectorDialog.scss";
import { ProfileImage } from "../ProfileImage";
import { RecipeItem } from "../RecipeItem";
import { FolderItem } from "../RecipeTree/FolderItem";

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
  const { user } = useRecoilValue(authStore);
  const { profile } = useRecoilValue(profileStore);
  const [
    {
      resolve,
      reject,
      payload: { folderOnly = false, disablePathUnder = undefined } = {},
    },
    setDialogState,
  ] = useRecoilState(RecipeSelectorDialogAtom);

  const [folderStack, setFolderStack] = useState<string[]>([]);
  const [{ userId, workspaceId }, setWorkspace] = useState<{
    userId?: string | null;
    workspaceId?: string | null;
  }>({ userId: null, workspaceId: null });

  const folderId = folderStack.at(-1);

  const { workspaces } = useAllWorkspaces();

  const { value: currentFolder } = useSWR<Folder>(
    `${userId}/${workspaceId}/folders/${folderId}`,
    () =>
      userId !== null && workspaceId !== null
        ? getFolder({ userId, workspaceId, folderId })
        : Promise.resolve(undefined)
  );

  const { value: folders } = useSWR<Folder[]>(
    `${userId}/${workspaceId}/foldersWithParent/${folderId}`,
    () =>
      userId !== null && workspaceId !== null
        ? getFoldersWithParent({ userId, workspaceId }, folderId)
        : Promise.resolve(undefined)
  );

  const { value: recipes } = useSWR<Recipe[]>(
    `${userId}/${workspaceId}/recipesWithParent/${folderId}`,
    () =>
      userId !== null && workspaceId !== null
        ? getRecipesWithParent({ userId, workspaceId }, folderId)
        : Promise.resolve(undefined)
  );

  const res = (r?: Recipe | string) => {
    if (resolve) {
      resolve(r);
    }
    setDialogState({});
  };

  const handleBackClick = () => {
    if (folderStack.length > 0) {
      setFolderStack(folderStack.slice(0, -1));
      return;
    }

    setWorkspace({ userId: null, workspaceId: null });
  };

  const handleRecipeClick = (recipe: Recipe) => {
    res(recipe);
  };

  const handleFolderClick = (folder: Folder) => {
    setFolderStack([...folderStack, String(folder._id)]);
  };

  useEffect(() => {
    if (!resolve || !reject) {
      setFolderStack([]);
      setWorkspace({ userId: null, workspaceId: null });
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
          {(currentFolder || userId !== null) && (
            <Button
              onClick={handleBackClick}
              variant="icon"
              iconBefore="arrow_back_ios_new"
            />
          )}
          <h3>
            {currentFolder && currentFolder.text}
            {!currentFolder && folderOnly && "Select Folder"}
            {!currentFolder && !folderOnly && "Select Recipe"}
          </h3>
        </header>

        <div className="ra-compact-list">
          {userId === null && workspaceId === null && (
            <>
              <Button
                before={
                  <ProfileImage
                    size="sm"
                    imageUrl={profile?.image?.imageUrl}
                    id={user?.uid}
                  />
                }
                variant="naked"
                onClick={() =>
                  setWorkspace({ userId: undefined, workspaceId: undefined })
                }
              >
                Personal Workspace
              </Button>
              <div />

              {...workspaces.map(({ uid, ws }) => (
                <Button
                  key={ws._id}
                  before={
                    <ProfileImage
                      size="sm"
                      emoji={ws?.icon}
                      imageUrl={ws?.image?.imageUrl}
                      id={ws._id}
                    />
                  }
                  variant="naked"
                  onClick={() =>
                    setWorkspace({ userId: uid, workspaceId: ws._id })
                  }
                >
                  {ws.name || "Untitled Workspace"}
                </Button>
              ))}
            </>
          )}

          {folders?.map((subFolder) => (
            <FolderItem
              key={subFolder._id}
              folder={subFolder}
              onClick={() => handleFolderClick(subFolder)}
            />
          ))}

          {recipes?.map((recipe) => (
            <RecipeItem
              key={recipe._id}
              recipe={recipe}
              onClick={() => handleRecipeClick(recipe)}
            />
          ))}

          {/* <RecipeTree
            folderOnly={folderOnly}
            folderId={currentFolder?._id}
            disablePathUnder={disablePathUnder}
            onRecipeClick={handleRecipeClick}
            onFolderClick={handleFolderClick}
          /> */}
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
