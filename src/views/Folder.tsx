import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useRecoilValue } from "recoil";

import Breadcrumbs from "../@design/components/Breadcrumbs/Breadcrumbs";
import MultilineInput from "../@design/components/MultilineInput/MultilineInput";
import {
  deleteFolder,
  getFolder,
  newFolder,
  saveFolder,
} from "../@modules/api/folders";
import { newRecipe } from "../@modules/api/recipes";
import { useFoldersWithParent } from "../@modules/hooks/folders";
import { useRecipesWithParent } from "../@modules/hooks/recipes";
import { workspaceStore } from "../@modules/stores/workspace";
import { Folder } from "../@modules/types/folder";
import { Recipe } from "../@modules/types/recipes";
import { useSWR } from "../@modules/utils/cache.react";
import { useBreadcrumbs } from "../@modules/utils/useBreadcrumbs";
import useMediaQuery from "../@modules/utils/useMediaQuery";

import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import DropMenu from "../components/Dialogs/DropMenu/DropMenu";
import { pickIcon } from "../components/Dialogs/IconPickerDialog";
import { selectFolder } from "../components/Dialogs/RecipeSelectorDialog";
import { FolderItem } from "../components/FolderItem";
import Loading from "../components/Loading";
import { RecipeItem } from "../components/RecipeItem";
import Spinner from "../components/Spinner";
import WorkspacePicker from "../components/WorkspacePicker";

export default function FolderView() {
  const { folderId } = useParams();
  const { userId, workspaceId } = useRecoilValue(workspaceStore);
  const isMobile = useMediaQuery("(max-width: 1000px)");

  const {
    loading: folderLoading,
    value: folder,
    updateValue: updateFolder,
  } = useSWR<Folder>(
    `${userId}/${workspaceId}/folders/${folderId}`,
    () => getFolder({ userId, workspaceId, folderId }),
    (newFolder) => saveFolder({ userId, workspaceId, folderId }, newFolder)
  );

  const { foldersLoading, folders, revalidateFolders } = useFoldersWithParent({
    userId,
    workspaceId,
    folderId,
  });

  const { recipesLoading, recipes, revalidateRecipes } = useRecipesWithParent(
    { userId, workspaceId },
    folderId
  );

  useEffect(() => {
    if (folder) {
      document.title = folder.text || "Untitled Folder";
    } else {
      document.title = "TasteMaker.dev";
    }
  }, [folder]);

  const navigate = useNavigate();
  const { breadcrumbs, revalidateBreadcrumbs } = useBreadcrumbs({
    userId,
    workspaceId,
    folderId,
  });

  const makeNewRecipe = async () => {
    await newRecipe({ userId, workspaceId }, { name: "", parent: folder?._id });
    revalidateRecipes();
  };

  const makeNewFolder = async () => {
    await newFolder(
      { userId, workspaceId },
      { text: "New Folder", parent: folder?._id }
    );
    revalidateFolders();
  };

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

    const newParent = await selectFolder(folder._id, { userId, workspaceId });
    if (newParent) {
      updateFolder((f) => (f.parent = newParent.folderId));
      revalidateBreadcrumbs();
    }
  };

  if (folderLoading || foldersLoading || recipesLoading) {
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

      {foldersLoading || recipesLoading ? (
        <Spinner />
      ) : (
        <>
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
        </>
      )}
    </AppView>
  );
}
