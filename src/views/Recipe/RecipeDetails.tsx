import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilValue } from "recoil";

import Breadcrumbs from "../../@design/components/Breadcrumbs/Breadcrumbs";
import Button from "../../@design/components/Button/Button";

import Input from "../../@design/components/Input/Input";
import MultilineInput from "../../@design/components/MultilineInput/MultilineInput";
import {
  deleteImage,
  uploadBannerImage,
  uploadIconImage,
} from "../../@modules/api/files";
import { deleteRecipe } from "../../@modules/api/recipes";
import { useRecipe } from "../../@modules/hooks/recipes";
import { authStore } from "../../@modules/stores/auth";
import { workspaceStore } from "../../@modules/stores/workspace";
import { useBreadcrumbs } from "../../@modules/utils/useBreadcrumbs";

import { usePickIcon } from "../../components/Dialogs/IconPickerDialog";
import { useSelectFolder } from "../../components/Dialogs/RecipeSelectorDialog";
import DropMenu from "../../components/DropMenu";
import AppHeader from "../../components/Global/AppHeader";
import AppView from "../../components/Global/AppView";
import ImageBanner from "../../components/ImageUpload";
import Loading from "../../components/Loading";

import IngredientList from "./IngredientList/IngredientList";

import "./RecipeDetails.scss";
import { StepList } from "./StepList/StepList";

export default function RecipeDetailsView() {
  const { recipeId } = useParams();
  const { userId, workspaceId } = useRecoilValue(workspaceStore);
  const { user } = useRecoilValue(authStore);
  const pickIcon = usePickIcon();
  const selectFolder = useSelectFolder();

  const [editing, setEditing] = useState<boolean>(false);

  const { recipeLoading, recipe, updateRecipe } = useRecipe({
    userId,
    workspaceId,
    recipeId,
  });

  useEffect(() => {
    if (recipe) {
      document.title = recipe.name || "Untitled Recipe";
    }

    // If the user has not set a name yet, default to editing mode
    if (recipe && !recipe?.name) {
      setEditing(true);
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

  const handleMove = async () => {
    const newParent = await selectFolder();
    if (newParent) {
      updateRecipe((r) => (r.parent = newParent.folderId));
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
        navigate("/recipes");
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

  const handlePickIcon = async () => {
    if (!recipe) return;

    const { deleted, newEmoji, newImage } =
      (await pickIcon({
        title: "Recipe Icon",
        emojiValue: recipe.icon,
        imageValue: recipe.iconImage,
      })) || {};

    // If we chose nothing, do nothing
    if (!deleted && !newEmoji && !newImage) return;

    // Delete existing image if need be
    if (recipe?.iconImage?.imageId) {
      deleteImage(recipe.iconImage.imageId);
    }

    // New image file was uploaded
    if (newImage) {
      const newIconImage = await uploadIconImage(newImage);
      updateRecipe((r) => {
        r.iconImage = newIconImage;
        r.icon = undefined;
      });
    }

    // Icon was deleted or an emoji was selected
    else {
      updateRecipe((r) => {
        if (deleted) {
          r.icon = undefined;
          r.iconImage = undefined;
        }

        if (newEmoji) {
          r.icon = newEmoji;
        }
      });
    }
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

  if (recipeLoading || !recipe) {
    return <Loading />;
  }

  return (
    <AppView
      header={
        <AppHeader
          subView
          before={
            recipe.parent && (
              <Breadcrumbs
                links={[
                  ...breadcrumbs,
                  { text: recipe.name || "Untitled Recipe" },
                ]}
              />
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

            <DropMenu
              options={[
                {
                  onClick: handleShareRecipe,
                  text: "Share recipe",
                  icon: "ios_share",
                },
                {
                  onClick: handlePickIcon,
                  text: recipe.icon ? "Change icon" : "Add recipe icon",
                  icon: "mood",
                },
                {
                  text: "Move recipe",
                  onClick: handleMove,
                  icon: "drive_file_move",
                },
                {
                  text: "Delete recipe",
                  onClick: handleDelete,
                  icon: "delete",
                },
              ]}
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
      {(recipe?.icon || recipe.iconImage) && (
        <span className="ra-icon" onClick={handlePickIcon}>
          {recipe.iconImage ? (
            <img src={recipe.iconImage.imageUrl} />
          ) : (
            recipe.icon
          )}
        </span>
      )}

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

        <IngredientList
          ingredients={recipe.ingredients}
          updateRecipe={updateRecipe}
          editing={editing}
          header
        />

        <StepList
          steps={recipe.steps}
          updateRecipe={updateRecipe}
          editing={editing}
        />
      </div>
    </AppView>
  );
}
