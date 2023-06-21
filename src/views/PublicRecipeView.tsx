import { useEffect } from "react";
import { useParams } from "react-router";

import { getProfile } from "../@modules/api/profile";
import { getRecipe } from "../@modules/api/recipes";
import { Profile } from "../@modules/types/profile";
import { Recipe } from "../@modules/types/recipes";
import { useSWR } from "../@modules/utils/cache.react";
import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import ImageUpload from "../components/ImageUpload";

import Loading from "../components/Loading";

import { ProfileImage } from "../components/ProfileImage";

import IngredientList from "./Recipe/IngredientList/IngredientList";

import "./Recipe/RecipeDetails.scss";
import StepItem from "./Recipe/StepList/StepItem";

export default function PublicRecipeView() {
  const { userId, recipeId, workspaceId } = useParams();

  const { loading, value: recipe } = useSWR<Recipe>(
    `${userId}/${workspaceId}/recipes/${recipeId}`,
    () => getRecipe({ userId, workspaceId, recipeId })
  );

  const { loading: profileLoading, value: profile } = useSWR<Profile>(
    `${userId}/${workspaceId}/profiles/${userId}`,
    () => getProfile(userId || "")
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
        noNav
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
      noNav
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
