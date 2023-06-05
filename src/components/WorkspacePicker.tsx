import { Fragment, useCallback, useState } from "react";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import { getAllWorkspaces, newWorkspace } from "../@modules/api/workspaces";
import { authStore } from "../@modules/stores/auth";
import { workspaceStore } from "../@modules/stores/workspace";
import { Workspace } from "../@modules/types/workspaces";
import useLoader, { LoaderFunc } from "../@modules/utils/useLoader";

import { ProfileImage } from "./ProfileImage";
import Spinner from "./Spinner";

import "./WorkspacePicker.scss";

export default function WorkspacePicker() {
  const [{ workspaceId }, setWorkspace] = useRecoilState(workspaceStore);
  const { user } = useRecoilValue(authStore);

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

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
    navigate("/");
    setIsOpen(false);
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    navigate(`/workspace/${user?.uid}/${workspaceId}`);
    setIsOpen(false);
  };

  const makeNewWorkspace = async () => {
    const workspaceId = await newWorkspace({ name: "Untitled Workspace" });
    if (workspaceId) {
      handleSwitchWorkspace(workspaceId);
      setIsOpen(false);
    }
  };

  if (!allWorkspaces) {
    return <Spinner />;
  }

  const selectedWorkspace = allWorkspaces.find((ws) => ws._id === workspaceId);

  return (
    <>
      <Button
        className="workspace-picker-button"
        variant="naked"
        before={<ProfileImage size="sm" id={selectedWorkspace?._id} />}
        onClick={() => setIsOpen(true)}
      >
        {selectedWorkspace?.name || "Personal Workspace"}
      </Button>

      {isOpen &&
        createPortal(
          <>
            <div className="ra-dialog ra-card workspace-picker">
              <span className="ra-card-header">
                <h2>Workspaces</h2>
              </span>
              <div className="workspace-picker-options">
                <Button
                  iconBefore="person"
                  variant="naked"
                  onClick={() => handleSwitchWorkspace()}
                >
                  Personal Workspace
                </Button>
                <div />

                {...allWorkspaces.map((ws) => (
                  <Fragment key={ws._id}>
                    <Button
                      iconBefore="account_tree"
                      variant="naked"
                      onClick={() => handleSwitchWorkspace(ws._id)}
                    >
                      {ws.name || "Untitled Workspace"}
                    </Button>
                    <Button
                      iconBefore="settings"
                      variant="icon"
                      size="sm"
                      onClick={() => handleWorkspaceSettings(ws._id)}
                    />
                  </Fragment>
                ))}
              </div>
              <div className="ra-actions">
                <Button iconBefore="add" size="sm" onClick={makeNewWorkspace}>
                  New Workspace
                </Button>
              </div>
            </div>
            <div className="ra-dialog-cover" onClick={() => setIsOpen(false)} />
          </>,
          document.body
        )}
    </>
  );
}
