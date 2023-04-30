import { useEffect, useRef, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import Input from "../../@design/components/Input/Input";
import {
  addIngredient,
  deleteIngredient,
} from "../../@modules/api/ingredients";

import { ingredientStore } from "../../@modules/stores/ingredients";
import SwipeToDelete from "../SwipeToDelete";

import "./EditIngredientDialog.scss";

const editIngredientDialog = atom<{
  resolve?: (r?: string) => void;
  reject?: (e: Error) => void;
  ingredient?: string;
}>({
  key: "editIngredientDialog",
  default: {},
});

export function editIngredient(ingredient: string) {
  return new Promise<string | undefined>((resolve, reject) => {
    setRecoil(editIngredientDialog, { resolve, reject, ingredient });
  });
}

export default function EditIngredientDialog() {
  const { ingredients } = useRecoilValue(ingredientStore);
  const [{ resolve, reject, ingredient }, setDialogState] =
    useRecoilState(editIngredientDialog);

  const [localIngredient, setLocalIngredient] = useState<string>(
    ingredient || ""
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalIngredient(ingredient || "");
  }, [ingredient]);

  useEffect(() => {
    if (resolve && reject && inputRef.current) {
      inputRef.current.focus();
    }
  }, [resolve, reject]);

  const res = (i?: string) => {
    if (resolve) {
      resolve(i);
    }
    setDialogState({});
  };

  const handleSaveIngredient = (i?: string) => {
    addIngredient(i || localIngredient);
    res(i || localIngredient);
  };

  const handleDeleteIngredient = (i: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ingredient "${i}"?`
    );
    if (confirmed) deleteIngredient(i);
  };

  if (!resolve || !reject) {
    return null;
  }

  return (
    <>
      <div className="ra-dialog ra-card edit-ingredient-dialog">
        <header className="ra-card-header">
          <h2>Editing Ingredient</h2>
        </header>

        <Input
          ref={inputRef}
          type="text"
          value={localIngredient || ""}
          onChange={(e) => setLocalIngredient(e.target.value.toLowerCase())}
          placeholder="ingredient"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSaveIngredient();
            }
          }}
          after={
            <Button
              onClick={() => setLocalIngredient("")}
              variant="icon"
              size="sm"
            >
              clear
            </Button>
          }
        />

        <div className="edit-ingredient-dialog-content ra-option-list">
          {ingredients
            .sort()
            .filter(
              (i) =>
                i.toLowerCase().includes(localIngredient.toLowerCase()) &&
                i.toLowerCase() !== localIngredient.toLowerCase()
            )
            .map((i) => (
              <SwipeToDelete key={i} onDelete={() => handleDeleteIngredient(i)}>
                <button
                  className="ra-option"
                  onClick={() => {
                    handleSaveIngredient(i);
                  }}
                >
                  {i}
                </button>
              </SwipeToDelete>
            ))}
        </div>
        <div className="ra-actions">
          <Button onClick={() => res(undefined)} variant="naked" size="sm">
            Cancel
          </Button>
          <Button
            onClick={() => handleSaveIngredient()}
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
