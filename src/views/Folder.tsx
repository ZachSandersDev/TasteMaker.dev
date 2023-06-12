import { useCallback, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useRecoilValue } from "recoil";

import Breadcrumbs from "../@design/components/Breadcrumbs/Breadcrumbs";
import MultilineInput from "../@design/components/MultilineInput/MultilineInput";
import {
  deleteFolder,
  getFolder,
  getFoldersWithParent,
  newFolder,
  saveFolder,
} from "../@modules/api/folders";
import { getRecipesWithParent, newRecipe } from "../@modules/api/recipes";
import { getWorkspace, saveWorkspace } from "../@modules/api/workspaces";
import { workspaceStore } from "../@modules/stores/workspace";
import { Folder } from "../@modules/types/folder";
import { Recipe } from "../@modules/types/recipes";
import { Workspace } from "../@modules/types/workspaces";
import { useBreadcrumbs } from "../@modules/utils/useBreadcrumbs";
import useLoader, { LoaderFunc } from "../@modules/utils/useLoader";
import useMediaQuery from "../@modules/utils/useMediaQuery";
import useUpdater from "../@modules/utils/useUpdater";

import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import DropMenu from "../components/Dialogs/DropMenu/DropMenu";
import { pickIcon } from "../components/Dialogs/IconPickerDialog";
import { selectFolder } from "../components/Dialogs/RecipeSelectorDialog";
import Loading from "../components/Loading";
import { RecipeItem } from "../components/RecipeItem";
import { FolderItem } from "../components/RecipeTree/FolderItem";
import Spinner from "../components/Spinner";
import WorkspacePicker from "../components/WorkspacePicker";

export default function FolderView() {
  const { folderId } = useParams();
  const { userId, workspaceId } = useRecoilValue(workspaceStore);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const workspaceLoader = useCallback<LoaderFunc<Workspace>>(
    (cb) => getWorkspace({ userId, workspaceId }, cb),
    [userId, workspaceId]
  );

  const {
    loading: workspaceLoading,
    data: workspace,
    setData: setWorkspace,
  } = useLoader<Workspace>(workspaceLoader, `/workspace/${workspaceId}`);

  const updateWorkspace = useUpdater(workspace, (newWorkspace) => {
    setWorkspace(newWorkspace);
    saveWorkspace({ userId, workspaceId }, newWorkspace);
  });

  const folderLoader = useCallback<LoaderFunc<Folder>>(
    (cb) => getFolder({ userId, workspaceId, folderId }, cb),
    [userId, workspaceId, folderId]
  );

  const {
    loading: folderLoading,
    data: folder,
    setData: setFolder,
  } = useLoader<Folder>(folderLoader, `/folder/${folderId}`);

  const updateFolder = useUpdater(folder, (newFolder) => {
    setFolder(newFolder);
    saveFolder({ userId, workspaceId, folderId }, newFolder);
  });

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

  useEffect(() => {
    if (folder) {
      document.title = folder.text || "Untitled Folder";
    } else {
      document.title = "TasteMaker.dev";
    }
  }, [folder]);

  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs({ userId, workspaceId, folderId });

  const makeNewRecipe = () =>
    newRecipe({ userId, workspaceId }, { name: "", parent: folder?._id });

  const makeNewFolder = () =>
    newFolder(
      { userId, workspaceId },
      { text: "New Folder", parent: folder?._id }
    );

  const handleRecipeClick = (recipe: Recipe) => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleFolderClick = (folder: Folder) => {
    navigate(`/folder/${folder._id}`);
  };

  const handleDeleteFolder = async () => {
    if (!folder?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this folder?\n(Recipes inside it will not be deleted)"
    );
    if (!confirmed) return;

    await deleteFolder({ userId, workspaceId, folderId });

    if (folder.parent) {
      navigate(`/folder/${folder.parent}`);
    } else {
      navigate("/");
    }
  };

  const handleRenameFolder = (text: string) => {
    updateFolder((f) => (f.text = text));
  };

  const handleChangeFolderIcon = async () => {
    const { deleted, newEmoji } =
      (await pickIcon({
        title: "Folder Icon",
        emojiValue: folder?.icon,
        emojiOnly: true,
      })) || {};

    updateFolder((f) => {
      if (deleted) f.icon = undefined;
      if (newEmoji) f.icon = newEmoji;
    });
  };

  const handleMove = async () => {
    if (!folder?._id) return;

    const newParent = await selectFolder(folder._id);
    if (newParent) {
      updateFolder((f) => (f.parent = newParent));
    }
  };

  if (
    folderLoading ||
    workspaceLoading ||
    subFoldersLoading ||
    recipesLoading
  ) {
    return <Loading />;
  }

  return (
    <AppView
      header={
        <AppHeader
          subView={folderId !== undefined}
          before={folderId && <Breadcrumbs links={breadcrumbs} />}
        >
          {!folderId && isMobile && <WorkspacePicker />}

          <div className="ra-actions">
            <DropMenu
              icon="add"
              options={[
                {
                  onClick: makeNewFolder,
                  text: "New Folder",
                  icon: "create_new_folder",
                },
                { onClick: makeNewRecipe, text: "New Recipe", icon: "notes" },
              ]}
            />

            {folder?._id && (
              <DropMenu
                options={[
                  {
                    onClick: handleChangeFolderIcon,
                    text: folder.icon ? "Change Icon" : "Add Folder Icon",
                    icon: "mood",
                  },
                  {
                    onClick: handleDeleteFolder,
                    text: "Delete Folder",
                    icon: "delete",
                  },
                  {
                    onClick: handleMove,
                    text: "Move Folder",
                    icon: "drive_file_move",
                  },
                ]}
              />
            )}
          </div>
        </AppHeader>
      }
    >
      {folder?.icon && (
        <span className="ra-icon" onClick={handleChangeFolderIcon}>
          {folder?.icon}
        </span>
      )}

      <div className="ra-header">
        {folder ? (
          <MultilineInput
            className="ra-title"
            value={folder.text || ""}
            placeholder="Untitled Folder"
            onChange={handleRenameFolder}
            variant="naked"
          />
        ) : (
          <MultilineInput
            className="ra-title"
            value={"Recipes"}
            variant="naked"
            disabled
          />
        )}
      </div>

      {subFoldersLoading || recipesLoading ? (
        <Spinner />
      ) : (
        <>
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
    </AppView>
  );
}
