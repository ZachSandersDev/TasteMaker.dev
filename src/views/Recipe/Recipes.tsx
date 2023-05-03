import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Breadcrumbs from "../../@design/components/Breadcrumbs/Breadcrumbs";
import Button from "../../@design/components/Button/Button";

import ContentEditable from "../../@design/components/ContentEditable/ContentEditable";
import {
  batchUpdateFolders,
  newFolder,
  saveFolder,
} from "../../@modules/api/folders";
import { batchUpdateRecipes, newRecipe } from "../../@modules/api/recipes";
import { stripItemID } from "../../@modules/api/utils";
import {
  folderStore,
  getBreadcrumbs,
  useFolder,
} from "../../@modules/stores/folders";
import { recipeStore } from "../../@modules/stores/recipes";
import { Folder, setFolderDefaults } from "../../@modules/types/folder";
import { Recipe, setRecipeDefaults } from "../../@modules/types/recipes";
import useMediaQuery from "../../@modules/utils/useMediaQuery";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import DropMenu from "../../components/Dialogs/DropMenu/DropMenu";
import IconPickerDialog from "../../components/Dialogs/IconPickerDialog";
import { selectFolder } from "../../components/Dialogs/RecipeSelectorDialog";
import RecipeTree from "../../components/RecipeTree/RecipeTree";

export default function RecipesView() {
  const { folderId = "" } = useParams();

  const { folders } = useRecoilValue(folderStore);
  const { recipes } = useRecoilValue(recipeStore);

  const originalFolder = useFolder(folderId);
  const [folder, setFolder] = useState<Folder | undefined>(originalFolder);
  const updateFolder = useUpdater<Folder>(folder, (f) => {
    setFolder(f);
    saveFolder(f);
  });

  useEffect(() => {
    if ((!originalFolder && folder) || originalFolder?._id !== folder?._id) {
      setFolder(originalFolder);
    }
  }, [originalFolder]);

  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 999px)");

  const makeNewRecipe = async () => {
    await newRecipe(
      setRecipeDefaults({ name: "Untitled Recipe", parent: folderId })
    );
  };

  const makeNewFolder = async () => {
    await newFolder(
      setFolderDefaults({
        text: "New Folder",
        parent: folderId,
      })
    );
  };

  const handleClick = (id: string | number | undefined, isRecipe: boolean) => {
    if (id === undefined) throw new Error("No ID passed to handleNavigate");

    if (isRecipe) {
      navigate(`/recipe/${id}`);
    } else {
      navigate(`/folder/${id}`);
    }
  };

  const handleDeleteFolder = async () => {
    if (!folder?._id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this folder? (Everything in it will be moved up into the parent folder)"
    );
    if (!confirmed) return;

    const recipeUpdates: Record<string, Recipe> = {};

    // Batch update all recipes under the folder
    for (const r of recipes) {
      if (r.parent === folder._id) {
        const newRecipe = stripItemID(r);
        newRecipe.parent = folder.parent;
        recipeUpdates[`/${r._id}`] = newRecipe;
      }
    }

    await batchUpdateRecipes(recipeUpdates);

    const folderUpdates: Record<string, Folder | null> = {
      [`/${folder._id}`]: null, // Delete this folder in the batch
    };

    // Batch update all subfolders
    for (const f of folders) {
      if (f.parent === folder._id) {
        const newFolder = stripItemID(f);
        newFolder.parent = folder.parent;
        folderUpdates[`/${f._id}`] = newFolder;
      }
    }

    await batchUpdateFolders(folderUpdates);
  };

  const handleRenameFolder = (text: string) => {
    updateFolder((f) => (f.text = text));
  };

  const handleChangeFolderIcon = (icon: string) => {
    updateFolder((f) => (f.icon = icon));
  };

  const handleMenu = async (option: string) => {
    if (!folder?._id) return;

    if (option === "DELETE") {
      handleDeleteFolder();
      navigate(`/folder/${folder.parent}`);
    }
    if (option === "MOVE") {
      const newParent = await selectFolder(folder._id);
      if (newParent) {
        updateFolder((f) => (f.parent = newParent));
      }
    }
  };

  return (
    <AppView
      header={
        <AppHeader
          subView={folder?._id !== undefined}
          before={
            !isMobile &&
            folder && (
              <Breadcrumbs
                links={[
                  { text: "All Recipes", href: "/" },
                  ...getBreadcrumbs(folder._id).map((n) => ({
                    text: n.text || "Untitled Folder",
                    href: "/folder/" + n._id,
                  })),
                ]}
              />
            )
          }
        >
          <div className="ra-actions">
            <Button onClick={makeNewFolder} title="New Folder" variant="icon">
              create_new_folder
            </Button>
            <Button onClick={makeNewRecipe} title="New Recipe" variant="icon">
              add
            </Button>

            {folder?._id && (
              <DropMenu
                icon="more_vert"
                onSelect={handleMenu}
                options={[
                  {
                    icon: "drive_file_move",
                    value: "MOVE",
                    text: "Move",
                  },
                  {
                    icon: "delete",
                    text: "Delete Folder",
                    value: "DELETE",
                    color: "var(--color-danger)",
                  },
                ]}
              />
            )}
          </div>
        </AppHeader>
      }
    >
      <div className="ra-view-header">
        {folder ? (
          <>
            <IconPickerDialog
              title="Folder Icon"
              placeholder={<i className="material-symbols-rounded">folder</i>}
              emojiValue={folder.icon}
              onEmojiChange={handleChangeFolderIcon}
              emojiOnly
            />
            <ContentEditable
              className="ra-title"
              value={folder.text || "Untitled Folder"}
              onChange={handleRenameFolder}
              naked
            />
          </>
        ) : (
          <h2 className="ra-title">All Recipes</h2>
        )}
      </div>

      <RecipeTree folderId={folder?._id} onClick={handleClick} />
    </AppView>
  );
}
