import { useEffect, useRef, useState } from "react";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import {
  addIngredient,
  deleteIngredient,
} from "../../@modules/api/ingredients";

import { ingredientStore } from "../../@modules/stores/ingredients";
import Input from "../Input";
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

  const inputRef = useRef<HTMLInputElement>();

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
          // @ts-expect-error Don't know don't give
          ref={inputRef}
          type="text"
          className="ra-input"
          value={localIngredient || ""}
          onChange={(e) => setLocalIngredient(e.target.value.toLowerCase())}
          placeholder="ingredient"
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSaveIngredient();
            }
          }}
          after={
            <button
              className="icon-button-sm material-symbols-rounded"
              onClick={() => setLocalIngredient("")}
            >
              clear
            </button>
          }
        />

        <div className="edit-ingredient-dialog-content">
          {ingredients
            .sort()
            .filter((i) =>
              i.toLowerCase().includes(localIngredient.toLowerCase())
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
          <button className="chip-button-naked" onClick={() => res(undefined)}>
            Cancel
          </button>
          <button
            className="chip-button"
            onClick={() => handleSaveIngredient()}
          >
            <i className="material-symbols-rounded">save</i>
            Save
          </button>
        </div>
      </div>
      <div className="ra-dialog-cover" onClick={() => res(undefined)}></div>
    </>
  );
}
