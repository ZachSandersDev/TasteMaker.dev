import { atom, useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import { getListsLive } from "../api/shoppingLists";
import { ShoppingList } from "../types/shoppingLists";

export const listStore = atom<{ listener: () => void, loading: boolean, lists: ShoppingList[] }>({
  key: "listStore",
  default: { listener: () => undefined, loading: false, lists: [] }
});

export function listenForLists() {
  const listener = getListsLive((lists) => {
    setRecoil(listStore, (state) => ({ ...state, lists, loading: false }));
  });

  setRecoil(listStore, (state) => ({ ...state, loading: true, listener }));
}

export function useList(listId: string): [ShoppingList | undefined, (newList: ShoppingList) => void] {
  const [state, setState] = useRecoilState(listStore);
  const { lists } = state;

  if (!listId) {
    return [undefined, () => undefined];
  }

  const updateList = (newList: ShoppingList) => {
    const listIndex = lists.findIndex(r => r._id === newList._id);
    if (listIndex === -1) throw "List not found";

    const newState = { ...state, lists: [...state.lists] };
    newState.lists[listIndex] = newList;
    setState(newState);
  };

  const list = lists.find(r => r._id === listId);
  return [list ? structuredClone(list) : undefined, updateList];
}