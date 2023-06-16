import {
  getShoppingList,
  getShoppingLists,
  saveShoppingList,
} from "../api/shoppingLists";
import { ShoppingList } from "../types/shoppingLists";
import { useSWR } from "../utils/cache.react";

export function getShoppingListCacheKey(listId: string) {
  return `/lists/${listId}`;
}

export function useShoppingList(listId: string) {
  const {
    loading: shoppingListLoading,
    value: shoppingList,
    updateValue: updateShoppingList,
  } = useSWR<ShoppingList>(
    getShoppingListCacheKey(listId),
    () => getShoppingList(listId),
    (list) => saveShoppingList(list)
  );

  return { shoppingListLoading, shoppingList, updateShoppingList };
}

export function useShoppingLists() {
  const {
    loading: shoppingListsLoading,
    value: shoppingLists,
    revalidate: revalidateShoppingLists,
  } = useSWR<ShoppingList[]>("/lists", () => getShoppingLists());

  return {
    shoppingListsLoading,
    shoppingLists,
    revalidateShoppingLists,
  };
}
