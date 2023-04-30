import { useState } from "react";
import { atom, useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button";

import parseRecipe from "../../@modules/parsers/textParser";

import { Recipe } from "../../@modules/types/recipes";
import ContentEditable from "../ContentEditable";

import "./ImportRecipeDialog.scss";

interface ImportRecipeDialogState {
  resolve?: (r?: Recipe) => void;
  reject?: (e: Error) => void;
  recipe?: Recipe;
}

const importRecipeDialog = atom<ImportRecipeDialogState>({
  key: "ImportRecipeDialog",
  default: {},
});

export function importRecipe(recipe: Recipe) {
  return new Promise<Recipe | undefined>((resolve, reject) => {
    setRecoil(importRecipeDialog, { resolve, reject, recipe });
  });
}

export default function ImportRecipeDialog() {
  const [{ resolve, reject, recipe }, setDialogState] =
    useRecoilState(importRecipeDialog);

  const [ingredientText, setIngredientText] = useState<string>("");
  const [stepText, setStepText] = useState<string>("");

  const res = (r?: Recipe) => {
    if (resolve) {
      resolve(r);
    }
    setDialogState({});
  };

  const handleSave = () => {
    if (!recipe)
      throw new Error("No recipe was passed into ImportRecipeDialog");
    res(parseRecipe(recipe, ingredientText, stepText));
  };

  if (!resolve || !reject) {
    return null;
  }

  return (
    <>
      <div className="ra-dialog ra-card import-recipe-dialog">
        <header className="ra-card-header">
          <h2>Import Recipe</h2>
        </header>

        <ContentEditable
          placeholder="Ingredients text"
          value={ingredientText}
          onChange={(v) => setIngredientText(v)}
          plaintext
        />

        <ContentEditable
          placeholder="Instructions text"
          value={stepText}
          onChange={(v) => setStepText(v)}
          plaintext
        />

        <div className="ra-actions">
          <Button onClick={() => res(undefined)} variant="naked" size="sm">
            Cancel
          </Button>
          <Button
            onClick={() => handleSave()}
            iconBefore="save"
            variant="filled"
            size="sm"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={() => res(undefined)}></div>
    </>
  );
}
