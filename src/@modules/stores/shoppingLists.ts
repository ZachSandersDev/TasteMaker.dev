import { atom, useRecoilValue } from "recoil";
import { setRecoil } from "recoil-nexus";

import { getListsLive } from "../api/shoppingLists";
import { ShoppingList } from "../types/shoppingLists";

export const listStore = atom<{ listener: () => void, loading: boolean, lists: ShoppingList[] }>({
  key: 'listStore',
  default: { listener: () => undefined, loading: false, lists: [] }
});

export function listenForLists() {
  const listener = getListsLive((lists) => {
    setRecoil(listStore, (state) => ({ ...state, lists, loading: false }))
  })

  setRecoil(listStore, (state) => ({ ...state, loading: true, listener }))
}

export function useList(listId: string) {
  const { lists } = useRecoilValue(listStore);
  return structuredClone(lists.find(r => r._id === listId))
}