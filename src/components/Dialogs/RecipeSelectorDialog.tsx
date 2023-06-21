import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import { FolderRefParams } from "../../@modules/api/folders";
import { RecipeRefParams } from "../../@modules/api/recipes";
import { WorkspaceRefParams } from "../../@modules/api/workspaces";
import { useFolder, useFoldersWithParent } from "../../@modules/hooks/folders";
import { useRecipesWithParent } from "../../@modules/hooks/recipes";
import { useAllWorkspaces } from "../../@modules/hooks/useAllWorkspaces";
import { authStore } from "../../@modules/stores/auth";
import { RecipeSelectorDialog } from "../../@modules/stores/dialogs";

import { profileStore } from "../../@modules/stores/profile";
import { Folder } from "../../@modules/types/folder";
import { Recipe } from "../../@modules/types/recipes";

import { FolderItem } from "../FolderItem";
import { ProfileImage } from "../ProfileImage";
import { RecipeItem } from "../RecipeItem";

import "./RecipeSelectorDialog.scss";

export interface RecipeSelectorResult {
  recipe?: RecipeRefParams;
  folder?: FolderRefParams;
}

export function useSelectRecipe() {
  const navigate = useNavigate();

  return () =>
    new Promise<RecipeRefParams | undefined>((resolve, reject) => {
      navigate("modal/recipe-selector");
      setRecoil(RecipeSelectorDialog, {
        resolve: ({ recipe } = {}) => resolve(recipe),
        reject,
        payload: { folderOnly: false },
      });
    });
}

export function useSelectFolder() {
  const navigate = useNavigate();

  return (disablePathUnder?: string, params?: WorkspaceRefParams) =>
    new Promise<FolderRefParams | undefined>((resolve, reject) => {
      navigate("modal/recipe-selector");
      setRecoil(RecipeSelectorDialog, {
        resolve: ({ folder } = {}) => resolve(folder),
        reject,
        payload: { folderOnly: true, disablePathUnder, params },
      });
    });
}

export default function RecipeSelectorDialogComponent() {
  const { user } = useRecoilValue(authStore);
  const { profile } = useRecoilValue(profileStore);
  const [
    {
      resolve,
      reject,
      payload: {
        folderOnly = false,
        disablePathUnder = undefined,
        params = undefined,
      } = {},
    },
    setDialogState,
  ] = useRecoilState(RecipeSelectorDialog);

  const [folderStack, setFolderStack] = useState<string[]>([]);
  const [workspace, setWorkspace] = useState<WorkspaceRefParams | undefined>(
    undefined
  );

  const { userId, workspaceId } = workspace || {};
  const folderId = folderStack.at(-1);

  const { workspaces } = useAllWorkspaces();

  const { folder: currentFolder } = useFolder({
    userId,
    workspaceId,
    folderId,
  });

  const { folders } = useFoldersWithParent({ userId, workspaceId, folderId });
  const { recipes } = useRecipesWithParent({ userId, workspaceId }, folderId);

  useEffect(() => {
    if (!resolve || !reject) {
      setFolderStack([]);
      setWorkspace(undefined);
    }
  }, [resolve, reject]);

  useEffect(() => {
    if (params) {
      setWorkspace(params);
    }
  }, [params]);

  if (!resolve || !reject) {
    return null;
  }

  const handleBackClick = () => {
    if (folderStack.length > 0) {
      setFolderStack(folderStack.slice(0, -1));
      return;
    }

    setWorkspace(undefined);
  };

  const handleRecipeClick = (recipe: Recipe) => {
    resolve({ recipe: { userId, workspaceId, recipeId: recipe._id } });
    setDialogState({});
  };

  const handleFolderClick = (folder: Folder) => {
    setFolderStack([...folderStack, String(folder._id)]);
  };

  const handleFolderAccept = () => {
    resolve({ folder: { userId, workspaceId, folderId } });
    setDialogState({});
  };

  const handleCancel = () => {
    resolve();
    setDialogState({});
  };

  return (
    <>
      <div className="ra-dialog ra-card recipe-selector-dialog">
        <header
          className="ra-card-header"
          style={{ justifyContent: "flex-start", gap: "var(--spacing)" }}
        >
          {(currentFolder || (!params && !!workspace)) && (
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
          {!params && !!workspace && (
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

          {folders
            ?.filter((f) => f._id !== disablePathUnder)
            .map((subFolder) => (
              <FolderItem
                key={subFolder._id}
                folder={subFolder}
                onClick={() => handleFolderClick(subFolder)}
              />
            ))}

          {!folderOnly &&
            recipes?.map((recipe) => (
              <RecipeItem
                key={recipe._id}
                recipe={recipe}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
        </div>

        {folderOnly && (
          <div className="ra-actions">
            <Button onClick={handleFolderAccept} size="sm">
              Select this folder
            </Button>
          </div>
        )}
      </div>
      <div className="ra-dialog-cover" onClick={handleCancel}></div>
    </>
  );
}
