import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import { newRecipe } from "../../@modules/api/recipes";
import { saveTree } from "../../@modules/api/tree";
import { treeStore } from "../../@modules/stores/tree";
import { setRecipeDefaults } from "../../@modules/types/recipes";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import ContentEditable from "../../components/ContentEditable";
import RecipeTree from "../../components/RecipeTree/RecipeTree";

export default function RecipesView() {
  const { folderId = "" } = useParams();
  const navigate = useNavigate();
  const { tree } = useRecoilValue(treeStore);

  const folder = tree.find((n) => String(n.id) === folderId);

  const makeNewRecipe = async () => {
    const id = await newRecipe(setRecipeDefaults({ name: "Untitled Recipe" }));
    if (!id) return;

    saveTree([
      ...tree,
      {
        id: uuid(),
        parent: folder?.id !== undefined ? folder.id : -1,
        text: "",
        data: id,
      },
    ]);
  };

  const makeNewFolder = async () => {
    saveTree([
      ...tree,
      {
        id: uuid(),
        parent: folder?.id !== undefined ? folder.id : -1,
        text: "New Folder",
      },
    ]);
  };

  const handleClick = (id: string | number | undefined, isRecipe: boolean) => {
    if (id === undefined) throw new Error("No ID passed to handleNavigate");

    if (isRecipe) {
      navigate(`/recipe/${id}`);
    } else {
      navigate(`/folder/${id}`);
    }
  };

  const deleteFolder = async (id: string | number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this folder? (Everything in it will be preserved)"
    );
    if (!confirmed) return;

    const newTree = structuredClone(tree);
    // Rehome everything to root
    const stuffUnderFolder = newTree.filter(
      (n) => String(n.parent) === String(id)
    );
    for (const node of stuffUnderFolder) {
      node.parent = -1;
    }

    const folderIndex = newTree.findIndex((n) => String(n.id) === String(id));
    if (folderIndex > -1) {
      newTree.splice(folderIndex, 1);
    }

    saveTree(newTree);
  };

  const renameFolder = (text: string) => {
    const newTree = structuredClone(tree);
    const node = newTree.find((tn) => String(tn.id) === folderId);
    if (!node) throw "Could not find node " + folderId;

    node.text = text;
    saveTree(newTree);
  };

  return (
    <AppView
      header={
        <AppHeader subView={folder?.id !== undefined}>
          <div className="ra-actions">
            <button
              className="icon-button material-symbols-rounded"
              onClick={makeNewFolder}
              title="New Folder"
            >
              create_new_folder
            </button>
            <button
              className="icon-button material-symbols-rounded"
              onClick={makeNewRecipe}
              title="New Recipe"
            >
              add
            </button>
          </div>
        </AppHeader>
      }
    >
      {folder ? (
        <ContentEditable
          className="ra-title"
          value={folder.text || "Untitled Folder"}
          onChange={renameFolder}
          naked
        />
      ) : (
        <h2 className="ra-title">All Recipes</h2>
      )}

      <RecipeTree
        folderId={folder?.id}
        onClick={handleClick}
        onFolderDelete={deleteFolder}
      />
    </AppView>
  );
}
