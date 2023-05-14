import { useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import { getListsLive } from "../api/shoppingLists";
import { ShoppingList } from "../types/shoppingLists";
import persistentAtom from "../utils/persistentAtom";

const LIST_PERSIST_KEY = "tm-list-store";

export const listStore = persistentAtom<{ loading: boolean, lists: ShoppingList[] }>({
  key: "listStore",
  default: { loading: false, lists: [] }
}, LIST_PERSIST_KEY, "lists");

export function listenForLists() {
  if (!localStorage.getItem(LIST_PERSIST_KEY)) {
    setRecoil(listStore, (state) => ({ ...state, loading: true, }));
  }

  const listener = getListsLive((lists) => {
    setRecoil(listStore, (state) => ({ ...state, lists, loading: false }));
  });

  return () => {
    listener();
    setRecoil(listStore, () => ({ lists: [], loading: false }));
  };
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