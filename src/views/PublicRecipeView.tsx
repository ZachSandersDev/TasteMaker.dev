import { useEffect } from "react";
import { useParams } from "react-router";

import { useProfile } from "../@modules/hooks/profile";
import { useRecipe } from "../@modules/hooks/recipes";

import AppHeader from "../components/Global/AppHeader";
import AppView from "../components/Global/AppView";
import ImageUpload from "../components/ImageUpload";
import Loading from "../components/Loading";
import { ProfileImage } from "../components/ProfileImage";

import IngredientList from "./Recipe/IngredientList/IngredientList";
import { StepList } from "./Recipe/StepList/StepList";

import "./Recipe/RecipeDetails.scss";

export default function PublicRecipeView() {
  const { userId, recipeId, workspaceId } = useParams();

  const { profileLoading, profile } = useProfile(userId || "");

  const { recipeLoading, recipe } = useRecipe({
    userId,
    recipeId,
    workspaceId,
  });

  useEffect(() => {
    if (recipe) {
      document.title = recipe.name || "TasteMaker.dev";
    }
  }, [recipe]);

  if (recipeLoading || profileLoading || !recipeId) {
    return <Loading />;
  }

  if (!recipe) {
    return (
      <AppView
        header={
          <AppHeader height="fit-content">
            <h1 className="ra-app-title">TasteMaker.dev</h1>
          </AppHeader>
        }
      >
        <span className="ra-error-message">
          The owner of this recipe has made it private.
        </span>
      </AppView>
    );
  }

  return (
    <AppView
      before={<ImageUpload editing={false} image={recipe.bannerImage} />}
    >
      <div className="ra-header">
        <ProfileImage
          size="md"
          imageUrl={profile?.image?.imageUrl}
          id={profile?.displayName || ""}
        />
      </div>

      <span className="ra-title">{recipe.name || "Untitled Recipe"}</span>

      {profile && (
        <div className="ra-header ra-sub-title">
          By: {profile?.displayName || "Anonymous User"}
        </div>
      )}

      <div className="recipe-details-container">
        {(recipe.prepTime || recipe.servingSize) && (
          <section className="ra-list">
            {recipe.prepTime && <span>{recipe.prepTime}</span>}
            {recipe.servingSize && <span>{recipe.servingSize}</span>}
          </section>
        )}

        <div>
          {!!recipe.ingredients.length && (
            <header className="ra-header">
              <h3>Ingredients</h3>
            </header>
          )}

          <IngredientList ingredients={recipe.ingredients} editing={false} />
        </div>

        <div>
          {!!recipe.steps.length && (
            <header className="ra-header">
              <h3>Steps</h3>
            </header>
          )}

          <StepList steps={recipe.steps} editing={false} />
        </div>
      </div>
    </AppView>
  );
}
