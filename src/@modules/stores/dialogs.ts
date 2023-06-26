import { atom } from "recoil";

import { ContextMenuDialogPayload } from "../../components/Dialogs/ContextMenuDialog";
import {
  IconPickerResult,
  IconPickerState,
} from "../../components/Dialogs/IconPickerDialog";
import { RecipeSelectorResult } from "../../components/Dialogs/RecipeSelectorDialog";
import { WorkspaceRefParams } from "../api/workspaces";

export interface DialogState<T, P> {
  resolve?: (r?: T) => void;
  reject?: (e: Error) => void;
  payload?: P;
}

export const RecipeSelectorDialog = atom<
  DialogState<
    RecipeSelectorResult,
    {
      folderOnly?: boolean;
      disablePathUnder?: string;
      params?: WorkspaceRefParams;
    }
  >
>({
  key: "recipeSelectorDialog",
  default: {},
});

export const EditIngredientDialog = atom<DialogState<string, string>>({
  key: "editIngredientDialog",
  default: {},
});

export const InviteUserDialog = atom<
  DialogState<string, { title: string; placeholder: string; value?: string }>
>({
  key: "inviteUserDialog",
  default: {},
});

export const IconPickerDialog = atom<
  DialogState<IconPickerResult, IconPickerState>
>({
  key: "iconPickerDialog",
  default: {},
});

export const ContextMenuDialog = atom<
  DialogState<void, ContextMenuDialogPayload>
>({
  key: "contextMenuDialog",
  default: {},
});
