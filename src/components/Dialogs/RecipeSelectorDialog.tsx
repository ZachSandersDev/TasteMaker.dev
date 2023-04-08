import { atom, useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import { recipeStore } from "../../@modules/stores/recipes";

import { Recipe } from "../../@modules/types/recipes";
import { RecipeItem } from "../RecipeItem";

import "./RecipeSelectorDialog.scss";

const recipeSelectorDialog = atom<{
  resolve?: (r?: Recipe) => void;
  reject?: (e: Error) => void;
    }>({
      key: "recipeSelectorDialog",
      default: {},
    });

export function selectRecipe() {
  return new Promise<Recipe | undefined>((resolve, reject) => {
    setRecoil(recipeSelectorDialog, { resolve, reject });
  });
}

export default function RecipeSelectorDialog() {
  const { recipes } = useRecoilValue(recipeStore);
  const [{ resolve, reject }, setDialogState] =
    useRecoilState(recipeSelectorDialog);

  const res = (r?: Recipe) => {
    if (resolve) {
      resolve(r);
      setDialogState({});
    }
  };

  const rej = (e: Error) => {
    if (reject) {
      reject(e);
      setDialogState({});
    }
  };

  if (!resolve || !reject) {
    return null;
  }

  return (
    <>
      <div className="ra-dialog ra-card recipe-selector-dialog">
        <header className="ra-header">
          <h3>Select Recipe</h3>
        </header>

        <div className="ra-list">
          {recipes.map((r) => (
            <RecipeItem key={r._id} recipeId={r._id} onClick={() => res(r)} />
          ))}
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={() => res(undefined)}></div>
    </>
  );
}
