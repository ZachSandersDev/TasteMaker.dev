import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import Breadcrumbs from "../../../@design/components/Breadcrumbs/Breadcrumbs";
import Button from "../../../@design/components/Button/Button";

import ContentEditable from "../../../@design/components/ContentEditable/ContentEditable";
import Input from "../../../@design/components/Input/Input";
import {
  deleteImage,
  uploadBannerImage,
  uploadIconImage,
} from "../../../@modules/api/files";
import { deleteRecipe, saveRecipe } from "../../../@modules/api/recipes";
import { authStore } from "../../../@modules/stores/auth";
import { getBreadcrumbs } from "../../../@modules/stores/folders";
import { useRecipe } from "../../../@modules/stores/recipes";
import { Recipe } from "../../../@modules/types/recipes";
import useMediaQuery from "../../../@modules/utils/useMediaQuery";
import useUpdater from "../../../@modules/utils/useUpdater";

import AppHeader from "../../../components/AppHeader";
import AppView from "../../../components/AppView";
import DropMenu from "../../../components/Dialogs/DropMenu/DropMenu";
import IconPickerDialog from "../../../components/Dialogs/IconPickerDialog";
import { importRecipe } from "../../../components/Dialogs/ImportRecipeDialog";
import { selectFolder } from "../../../components/Dialogs/RecipeSelectorDialog";
import ImageBanner from "../../../components/ImageUpload";

import IngredientList from "./IngredientList/IngredientList";
import StepItem from "./StepList/StepItem";

import "./RecipeDetails.scss";

export default function RecipeDetailsView() {
  const { recipeId } = useParams();
  const { user } = useRecoilValue(authStore);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 999px)");

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

  useEffect(() => {
    if (recipe) {
      document.title = recipe.name || "Untitled Recipe";
    }
  }, [recipe]);

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
        updateRecipe((r) => (r.parent = newParent));
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

  const handleNewBanner = async (imageFile: File) => {
    const newImage = await uploadBannerImage(imageFile);
    if (recipe?.bannerImage?.imageId) {
      deleteImage(recipe.bannerImage.imageId);
    }
    updateRecipe((r) => (r.bannerImage = newImage));
  };

  const handleNewIcon = async (imageFile: File) => {
    const newImage = await uploadIconImage(imageFile);
    if (recipe?.iconImage?.imageId) {
      deleteImage(recipe.iconImage.imageId);
    }
    updateRecipe((r) => (r.iconImage = newImage));
  };

  const handleNewEmojiIcon = async (emoji: string) => {
    if (recipe?.iconImage?.imageId) {
      deleteImage(recipe.iconImage.imageId);
    }
    updateRecipe((r) => {
      delete r.iconImage;
      r.icon = emoji;
    });
  };

  const handleShareRecipe = async () => {
    if (!recipe?._id || !user?.uid) return;

    if (!recipe.public) {
      const confirmed = window.confirm(
        "Do you want to publish this recipe for public viewing?"
      );
      if (!confirmed) return;
      updateRecipe((r) => (r.public = true));
    }

    const url = location.origin + `/public/${user.uid}/recipe/${recipe._id}`;
    const shareData: ShareData = {
      title: "TasteMaker.dev recipe",
      text: recipe.name || "Untitled Recipe",
      url,
    };

    const canShare = navigator.canShare?.(shareData);
    if (canShare) {
      navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(url);
      alert("Copied to clipboard!");
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
            !isMobile &&
            recipe.parent && (
              <Breadcrumbs
                links={[
                  { text: "All Recipes", href: "/" },
                  ...getBreadcrumbs(recipe.parent).map((f) => ({
                    text: f.text || "Untitled Folder",
                    href: "/folder/" + f._id,
                  })),
                  {
                    text: recipe.name || "Untitled Recipe",
                    href: "/recipe/" + recipe._id,
                  },
                ]}
              />
            )
          }
        >
          <div className="ra-actions">
            <Button onClick={() => setEditing(!editing)} variant="naked">
              {editing ? "Save" : "Edit"}
            </Button>

            <Button onClick={handleShareRecipe} variant="icon" size="xm">
              ios_share
            </Button>

            <DropMenu
              icon="more_horiz"
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
      before={
        <ImageBanner
          editing={editing}
          image={recipe.bannerImage}
          onChange={handleNewBanner}
        />
      }
    >
      <div className="ra-view-header">
        <IconPickerDialog
          title="Recipe Icon"
          emojiValue={recipe.icon}
          imageValue={recipe.iconImage}
          placeholder="🗒️"
          onEmojiChange={handleNewEmojiIcon}
          onImageChange={handleNewIcon}
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

      <div className="recipe-details-container">
        {(editing || recipe.prepTime || recipe.servingSize) && (
          <section className="ra-list">
            {editing ? (
              <Input
                style={{ width: "100%" }}
                placeholder="Prep Time"
                value={recipe.prepTime}
                onChange={(e) => setRecipeField("prepTime", e.target.value)}
              />
            ) : (
              recipe.prepTime && <span>{recipe.prepTime}</span>
            )}
            {editing ? (
              <Input
                style={{ width: "100%" }}
                placeholder="Serving Size"
                value={recipe.servingSize}
                onChange={(e) => setRecipeField("servingSize", e.target.value)}
              />
            ) : (
              recipe.servingSize && <span>{recipe.servingSize}</span>
            )}
          </section>
        )}

        <div>
          {(recipe.ingredients.length || editing) && (
            <header className="ra-header">
              <h3>Ingredients</h3>
              {editing && (
                <Button iconBefore="add" size="sm" onClick={addNewIngredient}>
                  New Ingredient
                </Button>
              )}
            </header>
          )}

          <IngredientList
            ingredients={recipe.ingredients}
            updateRecipe={updateRecipe}
            editing={editing}
          />
        </div>

        <div>
          {(recipe.steps.length || editing) && (
            <header className="ra-header">
              <h3>Steps</h3>
              {editing && (
                <Button iconBefore="add" size="sm" onClick={addNewStep}>
                  New Step
                </Button>
              )}
            </header>
          )}

          <Reorder.Group
            axis="y"
            values={recipe.steps}
            onReorder={(steps) => updateRecipe((r) => (r.steps = steps))}
            className="ra-list"
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
        </div>
      </div>
    </AppView>
  );
}