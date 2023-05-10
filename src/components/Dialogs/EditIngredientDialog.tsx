import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import Button from "../../@design/components/Button/Button";

import Input from "../../@design/components/Input/Input";
import {
  addIngredient,
  deleteIngredient,
} from "../../@modules/api/ingredients";

import { EditIngredientDialog } from "../../@modules/stores/dialogs";
import { ingredientStore } from "../../@modules/stores/ingredients";
import classNames from "../../@modules/utils/classNames";
import SwipeToDelete from "../SwipeToDelete";

import "./EditIngredientDialog.scss";

export function editIngredient(ingredient: string) {
  return new Promise<string | undefined>((resolve, reject) => {
    setRecoil(EditIngredientDialog, { resolve, reject, payload: ingredient });
  });
}

export default function EditIngredientDialogComponent() {
  const { ingredients } = useRecoilValue(ingredientStore);
  const [{ resolve, reject, payload: ingredient }, setDialogState] =
    useRecoilState(EditIngredientDialog);

  const [localIngredient, setLocalIngredient] = useState<string>(
    ingredient || ""
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<HTMLButtonElement[]>([]);

  const filteredIngredients = ingredients
    .sort()
    .filter(
      (i) =>
        i.toLowerCase().includes(localIngredient.toLowerCase()) &&
        i.toLowerCase() !== localIngredient.toLowerCase()
    );

  useEffect(() => {
    setLocalIngredient(ingredient || "");
  }, [ingredient]);

  useEffect(() => {
    if (resolve && reject && inputRef.current) {
      inputRef.current.focus();
    } else {
      setLocalIngredient("");
      setSelectedIndex(-1);
    }
  }, [resolve, reject]);

  useEffect(() => {
    if (optionRefs.current[selectedIndex]) {
      optionRefs.current[selectedIndex].scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

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

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "ArrowUp") {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : -1);
    } else if (e.key === "ArrowDown") {
      setSelectedIndex(
        selectedIndex < filteredIngredients.length - 2
          ? selectedIndex + 1
          : filteredIngredients.length - 1
      );
    } else if (e.key === "Enter" && filteredIngredients[selectedIndex]) {
      handleSaveIngredient(filteredIngredients[selectedIndex]);
    } else if (e.key === "Enter" && localIngredient) {
      handleSaveIngredient(localIngredient);
    }
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
          onChange={(e) => {
            setLocalIngredient(e.target.value);
            setSelectedIndex(-1);
          }}
          placeholder="ingredient"
          onKeyUp={handleKeyUp}
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
          {filteredIngredients.map((i, index) => (
            <SwipeToDelete key={i} onDelete={() => handleDeleteIngredient(i)}>
              <button
                className={classNames(
                  "ra-option",
                  selectedIndex === index && "hover"
                )}
                onClick={() => {
                  handleSaveIngredient(i);
                }}
                ref={(e) => (optionRefs.current[index] = e)}
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
