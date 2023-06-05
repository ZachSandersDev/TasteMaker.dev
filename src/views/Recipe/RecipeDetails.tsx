import { Reorder } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";
import { v4 as uuid } from "uuid";

import Breadcrumbs from "../../@design/components/Breadcrumbs/Breadcrumbs";
import Button from "../../@design/components/Button/Button";

import Input from "../../@design/components/Input/Input";
import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import {
  deleteImage,
  uploadBannerImage,
  uploadIconImage,
} from "../../@modules/api/files";
import {
  deleteRecipe,
  getRecipe,
  saveRecipe,
} from "../../@modules/api/recipes";
import { authStore } from "../../@modules/stores/auth";
import { workspaceStore } from "../../@modules/stores/workspace";
import { Recipe } from "../../@modules/types/recipes";
import { useBreadcrumbs } from "../../@modules/utils/useBreadcrumbs";

import useLoader, { LoaderFunc } from "../../@modules/utils/useLoader";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import AppView from "../../components/AppView";
import DropMenu from "../../components/Dialogs/DropMenu/DropMenu";
import IconPickerDialog from "../../components/Dialogs/IconPickerDialog";
import { importRecipe } from "../../components/Dialogs/ImportRecipeDialog";
import { selectFolder } from "../../components/Dialogs/RecipeSelectorDialog";
import ImageBanner from "../../components/ImageUpload";
import Loading from "../../components/Loading";

import IngredientList from "./IngredientList/IngredientList";
import StepItem from "./StepList/StepItem";

import "./RecipeDetails.scss";

export default function RecipeDetailsView() {
  const { recipeId } = useParams();
  const { userId, workspaceId } = useRecoilValue(workspaceStore);
  const { user } = useRecoilValue(authStore);

  const [editing, setEditing] = useState<boolean>(false);

  const recipeLoader = useCallback<LoaderFunc<Recipe>>(
    (cb) => getRecipe({ userId, workspaceId, recipeId }, cb),
    [userId, workspaceId, recipeId]
  );

  const {
    loading: recipeLoading,
    data: recipe,
    setData: setRecipe,
  } = useLoader<Recipe>(recipeLoader, `/recipe/${recipeId}`);

  const updateRecipe = useUpdater<Recipe>(recipe, (r) => {
    setRecipe(r);
    saveRecipe({ userId, workspaceId, recipeId }, r);
  });

  useEffect(() => {
    if (recipe) {
      document.title = recipe.name || "Untitled Recipe";
    }
  }, [recipe]);

  const navigate = useNavigate();
  const breadcrumbs = useBreadcrumbs(
    {
      userId,
      workspaceId,
      folderId: recipe?.parent || undefined,
    },
    true
  );

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

  const addNewSection = () => {
    updateRecipe((r) =>
      r.ingredients.push({
        value: "",
        units: "",
        ingredient: "",
        subHeading: true,
        _id: uuid(),
      })
    );
  };

  const addNewStep = () => {
    updateRecipe((r) => r.steps.push({ _id: uuid(), text: "" }));
  };

  const handleMove = async () => {
    const newParent = await selectFolder();
    if (newParent) {
      updateRecipe((r) => (r.parent = newParent));
    }
  };

  const handleImport = async () => {
    if (!recipe) throw "Recipe not loaded";
    const newRecipe = await importRecipe(recipe);
    if (newRecipe) {
      updateRecipe((r) => Object.assign(r, newRecipe));
    }
  };

  const handleDelete = async () => {
    if (!recipe) throw "Recipe not loaded";
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );
    if (confirmed) {
      deleteRecipe({ userId, workspaceId, recipeId });
      if (recipe.parent) {
        navigate(`/folder/${recipe.parent}`);
      } else {
        navigate("/");
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

  const handleRemoveIcons = () => {
    if (recipe?.iconImage?.imageId) {
      deleteImage(recipe.iconImage.imageId);
    }

    updateRecipe((r) => {
      delete r.iconImage;
      delete r.icon;
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

    let url = location.origin + `/public/${user.uid}/recipe/${recipe._id}`;
    if (workspaceId) {
      url =
        location.origin +
        `/public/workspace/${user.uid}/${workspaceId}/recipe/${recipe._id}`;
    }

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

  if (recipeLoading) {
    return <Loading />;
  }

  if (!recipe) {
    return <span className="ra-error-message">Recipe not found...</span>;
  }

  return (
    <AppView
      header={
        <AppHeader
          subView
          before={
            recipe.parent && (
              <Breadcrumbs links={[...breadcrumbs, { text: recipe.name }]} />
            )
          }
        >
          <div className="ra-actions">
            <Button
              title="Edit"
              onClick={() => setEditing(!editing)}
              variant={editing ? "chip" : "naked-chip"}
            >
              {editing ? "Save" : "Edit"}
            </Button>

            {!editing && (
              <>
                <Button
                  title="Share"
                  onClick={handleShareRecipe}
                  variant="icon"
                  size="xm"
                  iconBefore="ios_share"
                />

                <DropMenu
                  options={[
                    {
                      text: "Move recipe",
                      onClick: handleMove,
                      icon: "drive_file_move",
                    },
                    {
                      text: "Import ingredients",
                      onClick: handleImport,
                      icon: "format_list_bulleted_add",
                    },
                    {
                      text: "Delete recipe",
                      onClick: handleDelete,
                      icon: "delete",
                    },
                  ]}
                />
              </>
            )}
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
      <IconPickerDialog
        title="Recipe Icon"
        emojiValue={recipe.icon}
        imageValue={recipe.iconImage}
        onEmojiChange={handleNewEmojiIcon}
        onImageChange={handleNewIcon}
        onRemoveIcon={handleRemoveIcons}
        disabled={!editing}
      />

      <div className="ra-header">
        {editing ? (
          <MultilineInput
            className="ra-title"
            placeholder="Untitled Recipe"
            value={recipe.name}
            onChange={(v) => setRecipeField("name", v)}
            variant="naked"
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
            </header>
          )}

          <IngredientList
            ingredients={recipe.ingredients}
            updateRecipe={updateRecipe}
            editing={editing}
          />

          {editing && (
            <div className="ra-actions-left">
              <Button iconBefore="add" size="sm" onClick={addNewIngredient}>
                New Ingredient
              </Button>
              <Button iconBefore="add" size="sm" onClick={addNewSection}>
                New Section
              </Button>
            </div>
          )}
        </div>

        <div>
          {(recipe.steps.length || editing) && (
            <header className="ra-header">
              <h3>Steps</h3>
            </header>
          )}

          <Reorder.Group
            axis="y"
            values={recipe.steps}
            onReorder={(steps) => updateRecipe((r) => (r.steps = steps))}
            className="ra-list"
            as="div"
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

          {editing && (
            <div className="ra-actions-left">
              <Button iconBefore="add" size="sm" onClick={addNewStep}>
                New Step
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppView>
  );
}
