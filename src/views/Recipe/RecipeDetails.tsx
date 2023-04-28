import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { getRecoil } from "recoil-nexus";
import { v4 as uuid } from "uuid";

import { deleteRecipe, saveRecipe } from "../../@modules/api/recipes";
import { saveTree } from "../../@modules/api/tree";
import { useRecipe } from "../../@modules/stores/recipes";
import { getBreadcrumbs, treeStore } from "../../@modules/stores/tree";
import { Recipe } from "../../@modules/types/recipes";
import useMediaQuery from "../../@modules/utils/useMediaQuery";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import Breadcrumbs from "../../components/Breadcrumbs";
import ContentEditable from "../../components/ContentEditable";
import DropMenu from "../../components/Dialogs/DropMenu/DropMenu";
import EmojiPickerDialog from "../../components/Dialogs/EmojiPickerDialog";
import { importRecipe } from "../../components/Dialogs/ImportRecipeDialog";
import { selectFolder } from "../../components/Dialogs/RecipeSelectorDialog";
import IngredientList from "../../components/IngredientList/IngredientList";
import StepItem from "../../components/StepItem";

export default function RecipeDetailsView() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 999px)");

  const { tree } = useRecoilValue(treeStore);
  const treeNode = tree.find((n) => n.data === recipeId);

  const [editing, setEditing] = useState<boolean>(false);

  const originalRecipe = useRecipe(recipeId as string);
  const [recipe, setRecipe] = useState<Recipe | undefined>(originalRecipe);
  const updateRecipe = useUpdater<Recipe>(recipe, (r) => {
    setRecipe(r);
    saveRecipe(r);
  });

  useEffect(() => {
    if (originalRecipe && !recipe) {
      setRecipe(originalRecipe);
    }
  }, [originalRecipe]);

  const setRecipeField = (
    key: "name" | "servingSize" | "prepTime",
    value: string
  ) => {
    updateRecipe((r) => (r[key] = value));
  };

  const addNewIngredient = () => {
    updateRecipe((r) =>
      r.ingredients.push({
        value: "",
        units: "",
        ingredient: "",
        _id: uuid(),
      })
    );
  };

  const addNewStep = () => {
    updateRecipe((r) => r.steps.push({ _id: uuid(), text: "" }));
  };

  const handleMenu = async (option: string) => {
    if (!recipe) throw "Recipe not loaded";

    if (option === "MOVE") {
      const newParent = await selectFolder();
      if (newParent) {
        const { tree } = getRecoil(treeStore);
        const newTree = structuredClone(tree);
        const thisNode = newTree.find((n) => n.data === recipe._id);
        if (thisNode) {
          thisNode.parent = parseInt(newParent);
          saveTree(newTree);
        }
      }
    }

    if (option === "IMPORT") {
      const newRecipe = await importRecipe(recipe);
      if (newRecipe) {
        updateRecipe((r) => Object.assign(r, newRecipe));
      }
    }

    if (option === "DELETE") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this recipe?"
      );
      if (confirmed) {
        deleteRecipe(recipe._id);
        navigate(-1);
      }
    }
  };

  if (!recipe) {
    return <span className="ra-error-message">Recipe not found...</span>;
  }

  return (
    <AppView
      header={
        <AppHeader
          subView
          before={
            // !isMobile &&
            !isMobile &&
            treeNode && (
              <Breadcrumbs
                links={[
                  { text: "All Recipes", href: "/" },
                  ...getBreadcrumbs(treeNode.id).map((n) => ({
                    text: n.text || recipe.name || "Untitled Recipe",
                    href: "/folder/" + n.id,
                  })),
                ]}
              />
            )
            // )
          }
        >
          <div className="ra-actions">
            <button
              className="menu-button"
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Save" : "Edit"}
            </button>

            <DropMenu
              icon="more_vert"
              options={[
                {
                  icon: "drive_file_move",
                  value: "MOVE",
                  text: "Move",
                },
                {
                  icon: "download",
                  value: "IMPORT",
                  text: "Import recipe data",
                },
                {
                  icon: "delete",
                  value: "DELETE",
                  text: "Delete Recipe",
                  color: "var(--color-danger)",
                },
              ]}
              onSelect={handleMenu}
            />
          </div>
        </AppHeader>
      }
    >
      <div className="ra-view-header">
        <EmojiPickerDialog
          value={recipe.icon || "🗒️"}
          onEmojiChange={(emoji) => updateRecipe((r) => (r.icon = emoji))}
          disabled={!editing}
        />

        {editing ? (
          <ContentEditable
            className="ra-title"
            value={recipe.name || "Untitled Recipe"}
            onChange={(v) => setRecipeField("name", v)}
            naked
            plaintext
          />
        ) : (
          <span className="ra-title">{recipe.name || "Untitled Recipe"}</span>
        )}
      </div>

      <section className="ra-list">
        {editing ? (
          <input
            className="ra-input"
            style={{ width: "100%" }}
            placeholder="Prep Time"
            value={recipe.prepTime}
            onChange={(e) => setRecipeField("prepTime", e.target.value)}
          />
        ) : (
          recipe.prepTime && <span>{recipe.prepTime}</span>
        )}
        {editing ? (
          <input
            className="ra-input"
            style={{ width: "100%" }}
            placeholder="Serving Size"
            value={recipe.servingSize}
            onChange={(e) => setRecipeField("servingSize", e.target.value)}
          />
        ) : (
          recipe.servingSize && <span>{recipe.servingSize}</span>
        )}
      </section>

      <header className="ra-header">
        <h3>Ingredients</h3>
        {editing && (
          <button className="chip-button" onClick={addNewIngredient}>
            <i className="material-symbols-rounded">add</i>
            New Ingredient
          </button>
        )}
      </header>

      <IngredientList
        ingredients={recipe.ingredients}
        updateRecipe={updateRecipe}
        editing={editing}
      />

      <header className="ra-header">
        <h3>Steps</h3>
        {editing && (
          <button className="chip-button" onClick={addNewStep}>
            <i className="material-symbols-rounded">add</i>
            New Step
          </button>
        )}
      </header>

      <Reorder.Group
        axis="y"
        values={recipe.steps}
        onReorder={(steps) => updateRecipe((r) => (r.steps = steps))}
        className="ra-dense-list"
      >
        {recipe.steps.map((step, i) => (
          <StepItem
            step={step}
            key={step._id}
            index={i}
            updateRecipe={updateRecipe}
            editing={editing}
          />
        ))}
      </Reorder.Group>
    </AppView>
  );
}
