import { Unsubscribe } from "firebase/database";

import { listenForFolders } from "./folders";
import { listenForIngredients } from "./ingredients";
import { listenForMyProfile } from "./profile";
import { listenForRecipes } from "./recipes";
import { listenForLists } from "./shoppingLists";

const unsubscribers: Unsubscribe[] = [];

export function loadAllData() {
  if (unsubscribers.length) {
    return;
  }

  unsubscribers.push(
    listenForRecipes(),
    listenForFolders(),
    listenForLists(),
    listenForIngredients(),
    listenForMyProfile()
  );
}

export function unloadAllData() {
  unsubscribers.forEach(u => u());
  unsubscribers.splice(0, unsubscribers.length);
}
