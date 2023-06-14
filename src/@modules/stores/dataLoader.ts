import { Unsubscribe } from "firebase/database";

import { listenForIngredients } from "./ingredients";
import { listenForMyProfile } from "./profile";

const unsubscribers: Unsubscribe[] = [];

export function loadAllData() {
  if (unsubscribers.length) {
    return;
  }

  unsubscribers.push(listenForIngredients(), listenForMyProfile());
}

export function unloadAllData() {
  unsubscribers.forEach((u) => u());
  unsubscribers.splice(0, unsubscribers.length);
}
