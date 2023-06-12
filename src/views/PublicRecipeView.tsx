import { useCallback, useEffect } from "react";
import { useParams } from "react-router";

import { getProfile } from "../@modules/api/profile";
import { getRecipe } from "../@modules/api/recipes";
import { Profile } from "../@modules/types/profile";
import { Recipe } from "../@modules/types/recipes";
import useLoader, { LoaderFunc } from "../@modules/utils/useLoader";
import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import ImageUpload from "../components/ImageUpload";

import Loading from "../components/Loading";

import IngredientList from "./Recipe/IngredientList/IngredientList";
import StepItem from "./Recipe/StepList/StepItem";

import { ProfileImage } from "./Settings/ProfileImage";
import "./Recipe/RecipeDetails.scss";

export default function PublicRecipeView() {
  const { userId, recipeId, workspaceId } = useParams();

  const recipeLoader = useCallback<LoaderFunc<Recipe>>(
    (cb) => getRecipe({ userId, workspaceId, recipeId }, cb),
    [userId, workspaceId, recipeId]
  );

  const { loading, data: recipe } = useLoader(
    recipeLoader,
    `/recipe/${recipeId}`
  );

  const profileLoader = useCallback<LoaderFunc<Profile>>(
    (cb) => getProfile(userId || "", cb),
    [userId]
  );

  const { loading: profileLoading, data: profile } = useLoader(
    profileLoader,
    `/profile/${userId}`
  );

  useEffect(() => {
    if (recipe) {
      document.title = recipe.name || "TasteMaker.dev";
    }
  }, [recipe]);

  if (loading || profileLoading) {
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
        <ProfileImage size="md" profile={profile} />
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
          {recipe.ingredients.length && (
            <header className="ra-header">
              <h3>Ingredients</h3>
            </header>
          )}

          <IngredientList ingredients={recipe.ingredients} editing={false} />
        </div>

        <div>
          {recipe.steps.length && (
            <header className="ra-header">
              <h3>Steps</h3>
            </header>
          )}

          <div className="ra-list">
            {recipe.steps.map((step, i) => (
              <StepItem step={step} key={step._id} index={i} editing={false} />
            ))}
          </div>
        </div>
      </div>
    </AppView>
  );
}
