import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";

import { setRecipeDefaults } from "../@modules/types/recipes";
import { newRecipe } from "../@modules/api/recipes";
import { listenForRecipes, recipeStore } from "../@modules/stores/recipes";

import AppHeader from "../components/AppHeader";

export default function MyRecipes() {
  const { recipes } = useRecoilValue(recipeStore);

  useEffect(() => {
    listenForRecipes();
  }, []);

  const makeNewRecipe = () => {
    newRecipe(setRecipeDefaults({}));
  };

  return (
    <div className="ra-view">
      <AppHeader>
        <h2>My Recipes</h2>
      </AppHeader>

      <ul>
        {recipes.map((r) => (
          <li key={r._id}>
            <Link to={`/recipe/${r._id}`}>{r.name || "Untitled"}</Link>
          </li>
        ))}
      </ul>

      <button onClick={makeNewRecipe}>New Recipe</button>
    </div>
  );
}
