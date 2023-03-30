import { useState } from "react";
import { useParams } from "react-router";

import { Reorder } from "framer-motion";

import { saveRecipe } from "../@modules/api/recipes";
import { Ingredient, Recipe } from "../@modules/types/recipes";

import AppHeader from "../components/AppHeader";
import IngredientItem from "../components/IngredientItem";

import "./RecipeView.scss";
import { useRecipe } from "../@modules/stores/recipes";
import StepItem from "../components/StepItem";
import ContentEditable from "react-contenteditable";

function useNullishUpdater<T>(
  value: T | undefined | null,
  setValue: (newVal: T) => void
) {
  return function (update: (currentVal: T) => unknown) {
    if (value === undefined || value === null) {
      throw "Original value has not been loaded yet";
    }

    const newValue = structuredClone(value);
    update(newValue);
    setValue(newValue);
  };
}

export default function RecipeView() {
  const { recipeId } = useParams();

  const originalRecipe = useRecipe(recipeId as string);
  const [recipe, setRecipe] = useState<Recipe | undefined>(originalRecipe);
  const updateRecipe = useNullishUpdater<Recipe>(recipe, setRecipe);

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
        _id: crypto.randomUUID(),
      })
    );
  };

  const reorderIngredients = (ingredients: Ingredient[]) => {
    updateRecipe((r) => (r.ingredients = ingredients));
  };

  const addNewStep = () => {
    updateRecipe((r) => r.steps.push({ _id: crypto.randomUUID(), text: "" }));
  };

  const save = () => {
    if (!recipe) throw "Recipe is not loaded yet";
    saveRecipe(recipe);
  };

  return (
    <div className="ra-view">
      {recipe ? (
        <>
          <AppHeader subView>
            <ContentEditable
              className="name-field"
              html={recipe.name || "Untitled"}
              onChange={(e) => setRecipeField("name", e.target.value)}
            />

            <button
              className="icon-button material-symbols-rounded"
              onClick={save}
            >
              save
            </button>
          </AppHeader>

          <section className="recipe-section meta-section">
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

          <section className="recipe-section">
            <h3>Ingredients</h3>

            <Reorder.Group
              className="recipe-list"
              axis="y"
              as="div"
              values={recipe.ingredients}
              onReorder={reorderIngredients}
            >
              {recipe.ingredients.map((ingredient, i) => (
                <IngredientItem
                  ingredient={ingredient}
                  index={i}
                  key={ingredient._id}
                  updateRecipe={updateRecipe}
                />
              ))}
            </Reorder.Group>

            <button className="chip-button" onClick={addNewIngredient}>
              <i className="material-symbols-rounded">add</i>
              New Ingredient
            </button>
          </section>

          <section className="recipe-section">
            <h3>Steps</h3>

            <Reorder.Group
              axis="y"
              values={recipe.steps}
              onReorder={(steps) => updateRecipe((r) => (r.steps = steps))}
              className="recipe-list"
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

            <button className="chip-button" onClick={addNewStep}>
              <i className="material-symbols-rounded">add</i>
              New Step
            </button>
          </section>
        </>
      ) : (
        <span>Loading...</span>
      )}
    </div>
  );
}
