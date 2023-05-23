import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import { getFolder, getFoldersWithParent } from "../@modules/api/folders";
import { getRecipesWithParent, newRecipe } from "../@modules/api/recipes";
import { getWorkspace, getWorkspaces } from "../@modules/api/workspaces";
import { authStore } from "../@modules/stores/auth";
import { Folder } from "../@modules/types/folder";
import { Recipe } from "../@modules/types/recipes";
import { Workspace } from "../@modules/types/workspaces";
import useLoader, { LoaderFunc } from "../@modules/utils/useLoader";

import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import Loading from "../components/Loading";
import { RecipeItem } from "../components/RecipeItem";
import { FolderItem } from "../components/RecipeTree/FolderItem";
import Spinner from "../components/Spinner";
import { WorkspaceItem } from "../components/WorkspaceItem";

export default function FolderView() {
  const { folderId, userId, workspaceId } = useParams();
  const { user } = useRecoilValue(authStore);

  const workspaceLoader = useCallback<LoaderFunc<Workspace>>(
    (cb) => getWorkspace({ userId, workspaceId }, cb),
    [userId, workspaceId, folderId]
  );

  const { loading: workspaceLoading, data: workspace } = useLoader<Workspace>(
    workspaceLoader,
    `/workspace/${workspaceId}`
  );

  const folderLoader = useCallback<LoaderFunc<Folder>>(
    (cb) => getFolder({ userId, workspaceId, folderId }, cb),
    [userId, workspaceId, folderId]
  );

  const { loading: folderLoading, data: folder } = useLoader<Folder>(
    folderLoader,
    `/folder/${folderId}`
  );

  const subFolderLoader = useCallback<LoaderFunc<Folder[]>>(
    (cb) => getFoldersWithParent({ userId, workspaceId }, folderId, cb),
    [userId, workspaceId, folderId]
  );

  const { loading: subFoldersLoading, data: subFolders } = useLoader<Folder[]>(
    subFolderLoader,
    `/foldersWithParent/${folderId}`
  );

  const recipeLoader = useCallback<LoaderFunc<Recipe[]>>(
    (cb) => getRecipesWithParent({ userId, workspaceId }, folderId, cb),
    [userId, workspaceId, folderId]
  );

  const { loading: recipesLoading, data: recipes } = useLoader<Recipe[]>(
    recipeLoader,
    `/recipesWithParent/${folderId}`
  );

  const workspacesLoader = useCallback<LoaderFunc<Workspace[]>>(
    (cb) => getWorkspaces(cb),
    [userId, workspaceId, folderId]
  );

  const { loading: workspacesLoading, data: workspaces } = useLoader<
    Workspace[]
  >(workspacesLoader, "/workspaces");

  // const { folders } = useRecoilValue(folderStore);
  // const { recipes } = useRecoilValue(recipeStore);
  // const { data: workspaces } = useRecoilValue(workspaceStore);

  // const [folder, setFolder] = useFolder(folderId);
  // const updateFolder = useUpdater<Folder>(folder, (f) => {
  //   setFolder(f);
  //   saveFolder(f);
  // });

  useEffect(() => {
    if (folder) {
      document.title = folder.text || "Untitled Folder";
    } else {
      document.title = "TasteMaker.dev";
    }
  }, [folder]);

  const navigate = useNavigate();
  // const breadcrumbs = useBreadcrumbs(folderId);

  const makeNewRecipe = async () => {
    await newRecipe({ userId, workspaceId }, { name: "", parent: folder?._id });
  };

  // const makeNewFolder = async () => {
  //   await newFolder(
  //     setFolderDefaults({
  //       text: "New Folder",
  //       parent: folder?._id,
  //     })
  //   );
  // };

  // const makeNewWorkspace = async () => {
  //   await newWorkspace(
  //     setWorkspaceDefaults({
  //       name: "New Workspace",
  //     })
  //   );
  // };

  // const handleRecipeClick = (recipe: Recipe) => {
  //   navigate(`/recipe/${recipe._id}`);
  // };

  const handleRecipeClick = (recipe: Recipe) => {
    if (userId && workspaceId) {
      navigate(`/workspace/${userId}/${workspaceId}/recipe/${recipe._id}`);
    } else {
      navigate(`/recipe/${recipe._id}`);
    }
  };

  const handleFolderClick = (folder: Folder) => {
    if (userId && workspaceId) {
      navigate(`/workspace/${userId}/${workspaceId}/folder/${folder._id}`);
    } else {
      navigate(`/folder/${folder._id}`);
    }
  };

  const handleWorkspaceClick = (workspace: Workspace) => {
    if (!user) return;
    navigate(`/workspace/${user.uid}/${workspace._id}/`);
  };

  // const handleDeleteFolder = async () => {
  //   if (!folder?._id) return;

  //   const confirmed = window.confirm(
  //     "Are you sure you want to delete this folder? (Everything in it will be moved up into the parent folder)"
  //   );
  //   if (!confirmed) return;

  //   const recipeUpdates: Record<string, Recipe> = {};

  //   // Batch update all recipes under the folder
  //   for (const r of recipes) {
  //     if (r.parent === folder._id) {
  //       const newRecipe = stripItemID(r);
  //       newRecipe.parent = folder.parent;
  //       recipeUpdates[`/${r._id}`] = newRecipe;
  //     }
  //   }

  //   await batchUpdateRecipes(recipeUpdates);

  //   const folderUpdates: Record<string, Folder | null> = {
  //     [`/${folder._id}`]: null, // Delete this folder in the batch
  //   };

  //   // Batch update all subfolders
  //   for (const f of folders) {
  //     if (f.parent === folder._id) {
  //       const newFolder = stripItemID(f);
  //       newFolder.parent = folder.parent;
  //       folderUpdates[`/${f._id}`] = newFolder;
  //     }
  //   }

  //   await batchUpdateFolders(folderUpdates);

  //   if (folder.parent) {
  //     navigate(`/folder/${folder.parent}`);
  //   } else {
  //     navigate("/");
  //   }
  // };

  // const handleRenameFolder = (text: string) => {
  //   updateFolder((f) => (f.text = text));
  // };

  // const handleChangeFolderIcon = (icon?: string) => {
  //   updateFolder((f) => (f.icon = icon));
  // };

  // const handleMove = async () => {
  //   if (!folder?._id) return;

  //   const newParent = await selectFolder(folder._id);
  //   if (newParent) {
  //     updateFolder((f) => (f.parent = newParent));
  //   }
  // };

  if (
    folderLoading ||
    workspaceLoading ||
    subFoldersLoading ||
    recipesLoading ||
    workspacesLoading
  ) {
    return <Loading />;
  }

  return (
    <AppView
      header={
        <AppHeader
          subView={folder?._id !== undefined}
          // before={folder && <Breadcrumbs links={breadcrumbs} />}
        >
          <div className="ra-actions">
            {/* {folder?._id && (
          <>
            <Button
              onClick={handleDeleteFolder}
              title="Delete Folder"
              variant="icon"
              iconBefore="delete"
            />
            <Button
              onClick={handleMove}
              title="Move Folder"
              variant="icon"
              iconBefore="drive_file_move"
            />
          </>
        )}
        <Button
          onClick={makeNewWorkspace}
          title="New Workspace"
          variant="icon"
          iconBefore="create_new_folder"
        />
        <Button
          onClick={makeNewFolder}
          title="New Folder"
          variant="icon"
          iconBefore="create_new_folder"
        /> */}
            <Button
              onClick={makeNewRecipe}
              title="New Recipe"
              variant="icon"
              iconBefore="add"
            />
          </div>
        </AppHeader>
      }
    >
      <div className="ra-header">
        {workspace ? (
          <h2 className="ra-title">
            {workspace ? workspace.name || "Untitled Folder" : "Recipes"}
          </h2>
        ) : (
          <h2 className="ra-title">
            {folder ? folder.text || "Untitled Folder" : "Recipes"}
          </h2>
        )}
      </div>

      {workspacesLoading || subFoldersLoading || recipesLoading ? (
        <Spinner />
      ) : (
        <>
          {!folder?._id &&
            !workspace?._id &&
            workspaces?.map((workspace) => (
              <WorkspaceItem
                key={workspace._id}
                workspace={workspace}
                onClick={() => handleWorkspaceClick(workspace)}
              />
            ))}

          {subFolders?.map((subFolder) => (
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
        </>
      )}

      {/* {folder ? (
        <>
          <IconPickerDialog
            title="Folder Icon"
            emojiValue={folder.icon}
            // onEmojiChange={handleChangeFolderIcon}
            // onRemoveIcon={handleChangeFolderIcon}
            emojiOnly
          />
          <div className="ra-header">
            <MultilineInput
              className="ra-title"
              value={folder.text || "Untitled Folder"}
              // onChange={handleRenameFolder}
              variant="naked"
            />
          </div>
        </>
      ) : (
        <></>
        // <div className="ra-header">
        //   <h2 className="ra-title">Recipes</h2>
        // </div>
      )} */}
      {/* {!folder && (
        <>
          <div className="ra-header ra-title">Shared Folders</div>
          {Object.entries(workspaces || {}).map(([workspaceId, workspace]) => (
            <WorkspaceItem key={workspaceId} workspace={workspace} />
          ))}

          <div className="ra-header ra-title"></div>
          <div className="ra-header ra-title">Private Folders</div>
        </>
      )}

      <RecipeTree
        folderId={folder?._id}
        onRecipeClick={handleRecipeClick}
        onFolderClick={handleFolderClick}
      /> */}
    </AppView>
  );
}
