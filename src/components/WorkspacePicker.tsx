import { useCallback } from "react";

import { useRecoilState, useRecoilValue } from "recoil";

import { getAllWorkspaces, newWorkspace } from "../@modules/api/workspaces";
import { authStore } from "../@modules/stores/auth";
import { workspaceStore } from "../@modules/stores/workspace";
import { Workspace } from "../@modules/types/workspaces";
import useLoader, { LoaderFunc } from "../@modules/utils/useLoader";

import DropMenu from "./Dialogs/DropMenu/DropMenu";
import Spinner from "./Spinner";

export default function WorkspacePicker() {
  const [{ workspaceId }, setWorkspace] = useRecoilState(workspaceStore);

  const { user } = useRecoilValue(authStore);

  const allWorkspacesLoader = useCallback<LoaderFunc<Workspace[]>>(
    (cb) => getAllWorkspaces(cb),
    []
  );

  const { data: allWorkspaces } = useLoader<Workspace[]>(
    allWorkspacesLoader,
    "/workspaces"
  );

  const handleSwitchWorkspace = (workspaceId?: string) => {
    if (!workspaceId) {
      setWorkspace({});
    } else {
      setWorkspace({ userId: user?.uid, workspaceId });
    }
  };

  const makeNewWorkspace = async () => {
    const workspaceId = await newWorkspace({ name: "Untitled Workspace" });
    if (workspaceId) {
      handleSwitchWorkspace(workspaceId);
    }
  };

  if (!allWorkspaces) {
    return <Spinner />;
  }

  const selectedWorkspace = allWorkspaces.find((ws) => ws._id === workspaceId);

  return (
    <DropMenu
      icon="account_tree"
      options={[
        {
          icon: "person",
          text: "Personal Workspace",
          onClick: () => handleSwitchWorkspace(),
        },

        ...allWorkspaces.map((ws) => ({
          icon: "account_tree",
          text: ws.name || "Untitled Workspace",
          onClick: () => handleSwitchWorkspace(ws._id),
        })),

        {
          icon: "add",
          text: "New Workspace",
          onClick: makeNewWorkspace,
        },
      ]}
      selected={selectedWorkspace?.name || "Personal Workspace"}
    />
  );
}
