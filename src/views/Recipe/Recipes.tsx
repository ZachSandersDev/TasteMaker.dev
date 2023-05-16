import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Breadcrumbs from "../../@design/components/Breadcrumbs/Breadcrumbs";
import Button from "../../@design/components/Button/Button";

import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import {
  batchUpdateFolders,
  newFolder,
  saveFolder,
} from "../../@modules/api/folders";
import { batchUpdateRecipes, newRecipe } from "../../@modules/api/recipes";
import { stripItemID } from "../../@modules/api/utils";
import { folderStore, useFolder } from "../../@modules/stores/folders";
import { recipeStore } from "../../@modules/stores/recipes";
import { Folder, setFolderDefaults } from "../../@modules/types/folder";
import { Recipe, setRecipeDefaults } from "../../@modules/types/recipes";
import { useBreadcrumbs } from "../../@modules/utils/useBreadcrumbs";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import IconPickerDialog from "../../components/Dialogs/IconPickerDialog";
import { selectFolder } from "../../components/Dialogs/RecipeSelectorDialog";
import RecipeTree from "../../components/RecipeTree/RecipeTree";

export default function RecipesView() {
  const { folderId } = useParams();

  const { folders } = useRecoilValue(folderStore);
  const { recipes } = useRecoilValue(recipeStore);

  const [folder, setFolder] = useFolder(folderId);
  const updateFolder = useUpdater<Folder>(folder, (f) => {
    setFolder(f);
    saveFolder(f);
  });

  useEffect(() => {
    if (folder) {
      document.title = folder.text || "Untitled Folder";
    } else {
      document.title = "TasteMaker.dev";
    }
  }, [folder]);

  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs(folderId);

  const makeNewRecipe = async () => {
    await newRecipe(
      setRecipeDefaults({
        name: "Untitled Recipe",
        parent: folder?._id,
      })
    );
  };

  const makeNewFolder = async () => {
    await newFolder(
      setFolderDefaults({
        text: "New Folder",
        parent: folder?._id,
      })
    );
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

    if (folder.parent) {
      navigate(`/folder/${folder.parent}`);
    } else {
      navigate("/");
    }
  };

  const handleRenameFolder = (text: string) => {
    updateFolder((f) => (f.text = text));
  };

  const handleChangeFolderIcon = (icon: string) => {
    updateFolder((f) => (f.icon = icon));
  };

  const handleMove = async () => {
    if (!folder?._id) return;

    const newParent = await selectFolder(folder._id);
    if (newParent) {
      updateFolder((f) => (f.parent = newParent));
    }
  };

  return (
    <AppView
      header={
        <AppHeader
          subView={folder?._id !== undefined}
          before={folder && <Breadcrumbs links={breadcrumbs} />}
        >
          <div className="ra-actions">
            {folder?._id && (
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
              onClick={makeNewFolder}
              title="New Folder"
              variant="icon"
              iconBefore="create_new_folder"
            />
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
      {folder ? (
        <>
          <IconPickerDialog
            title="Folder Icon"
            placeholder={<i className="material-symbols-rounded">folder</i>}
            emojiValue={folder.icon}
            onEmojiChange={handleChangeFolderIcon}
            emojiOnly
          />
          <div className="ra-header">
            <MultilineInput
              className="ra-title"
              value={folder.text || "Untitled Folder"}
              onChange={handleRenameFolder}
              variant="naked"
            />
          </div>
        </>
      ) : (
        <div className="ra-view-header">
          <h2 className="ra-title">All Recipes</h2>
        </div>
      )}

      <RecipeTree
        folderId={folder?._id}
        onRecipeClick={handleRecipeClick}
        onFolderClick={handleFolderClick}
      />
    </AppView>
  );
}
