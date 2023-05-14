import { Unsubscribe } from "firebase/database";

import { listenForFolders } from "./folders";
import { listenForIngredients } from "./ingredients";
import { listenForRecipes } from "./recipes";
import { listenForLists } from "./shoppingLists";

const unsubscribers: Unsubscribe[] = [];

export function loadAllData() {
  if (unsubscribers.length) {
    return;
  }

  console.log("Loading data!");

  unsubscribers.push(
    listenForRecipes(),
    listenForFolders(),
    listenForLists(),
    listenForIngredients()
  );
}

export function unloadAllData() {
  console.log("Unloading data!");

  unsubscribers.forEach(u => u());
  unsubscribers.splice(0, unsubscribers.length);
}
