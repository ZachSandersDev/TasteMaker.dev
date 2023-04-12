import { Reorder } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 as uuid } from "uuid";

import { deleteRecipe, saveRecipe } from "../../@modules/api/recipes";
import { useRecipe } from "../../@modules/stores/recipes";
import { Ingredient, Recipe } from "../../@modules/types/recipes";
import useUpdater from "../../@modules/utils/useUpdater";

import AppHeader from "../../components/AppHeader";
import ContentEditable from "../../components/ContentEditable";
import EmojiPickerDialog from "../../components/Dialogs/EmojiPickerDialog";
import DropMenu from "../../components/DropMenu";
import IngredientItem from "../../components/IngredientItem";
import StepItem from "../../components/StepItem";

export default function RecipeDetailsView() {
  const { recipeId } = useParams();
  const navigate = useNavigate();

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

  const reorderIngredients = (ingredients: Ingredient[]) => {
    updateRecipe((r) => (r.ingredients = ingredients));
  };

  const addNewStep = () => {
    updateRecipe((r) => r.steps.push({ _id: uuid(), text: "" }));
  };

  const handleMenu = (option: string) => {
    if (!recipe) throw "Recipe not loaded";

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
    <div className="ra-view">
      <AppHeader subView>
        <div className="ra-actions">
          <DropMenu
            icon="more_vert"
            options={[
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

      <div className="ra-view-content">
        <section className="ra-list">
          <div className="ra-row" style={{alignItems: "center"}}>

            <EmojiPickerDialog
              value={recipe.icon || "🗒️"}
              onEmojiChange={(emoji) => updateRecipe((r) => (r.icon = emoji))}
            />

            <ContentEditable
              className="ra-title"
              value={recipe.name || "Untitled Recipe"}
              onChange={(v) => setRecipeField("name", v)}
              naked
            />
          </div>

          <input
            className="ra-input"
            placeholder="Prep Time"
            value={recipe.prepTime}
            onChange={(e) => setRecipeField("prepTime", e.target.value)}
          />
          <input
            className="ra-input"
            placeholder="Serving Size"
            value={recipe.servingSize}
            onChange={(e) => setRecipeField("servingSize", e.target.value)}
          />
        </section>

        <header className="ra-header">
          <h3>Ingredients</h3>
          <button className="chip-button" onClick={addNewIngredient}>
            <i className="material-symbols-rounded">add</i>
            New Ingredient
          </button>
        </header>

        <Reorder.Group
          className="ra-dense-list"
          axis="y"
          as="div"
          values={recipe.ingredients}
          onReorder={reorderIngredients}
        >
          {recipe.ingredients.map((ingredient, i) => (
            <IngredientItem
              ingredient={ingredient}
              key={ingredient._id}
              updateIngredient={(newIngredient) =>
                updateRecipe((r) => r.ingredients.splice(i, 1, newIngredient))
              }
              deleteIngredient={() =>
                updateRecipe((r) => r.ingredients.splice(i, 1))
              }
            />
          ))}
        </Reorder.Group>

        <header className="ra-header">
          <h3>Steps</h3>
          <button className="chip-button" onClick={addNewStep}>
            <i className="material-symbols-rounded">add</i>
            New Step
          </button>
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
            />
          ))}
        </Reorder.Group>
      </div>
    </div>
  );
}