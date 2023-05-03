import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { getPublicRecipe } from "../@modules/api/recipes";
import { Recipe } from "../@modules/types/recipes";
import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import IconPickerDialog from "../components/Dialogs/IconPickerDialog";
import ImageUpload from "../components/ImageUpload";

import IngredientList from "./Recipe/Details/IngredientList/IngredientList";
import StepItem from "./Recipe/Details/StepList/StepItem";

import "./Recipe/Details/RecipeDetails.scss";

export default function PublicRecipeView() {
  const { userId, recipeId } = useParams();

  const [recipe, setRecipe] = useState<Recipe>();

  useEffect(() => {
    (async () => {
      if (userId && recipeId) {
        const recipe = await getPublicRecipe(userId, recipeId);
        if (!recipe) return;
        setRecipe(recipe);
        document.title = recipe.name || "Untitled Recipe";
      }
    })();
  }, [userId, recipeId]);

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
      header={
        <AppHeader height="fit-content">
          <h1 className="ra-app-title">TasteMaker.dev</h1>
        </AppHeader>
      }
      before={<ImageUpload editing={false} image={recipe.bannerImage} />}
    >
      <div className="ra-view-header">
        <IconPickerDialog
          title="Recipe Icon"
          emojiValue={recipe.icon}
          imageValue={recipe.iconImage}
          placeholder="🗒️"
          disabled
        />

        <span className="ra-title">{recipe.name || "Untitled Recipe"}</span>
      </div>

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
