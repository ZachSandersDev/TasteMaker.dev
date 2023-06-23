import { Fragment, useState } from "react";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import { newWorkspace } from "../@modules/api/workspaces";
import { useAllWorkspaces } from "../@modules/hooks/useAllWorkspaces";
import { authStore } from "../@modules/stores/auth";
import { workspaceStore } from "../@modules/stores/workspace";

import Spinner from "./Spinner";
import { WorkspaceItem } from "./ListItems/WorkspaceItem";

import "./WorkspacePicker.scss";

export default function WorkspacePicker() {
  const [{ workspaceId }, setWorkspace] = useRecoilState(workspaceStore);
  const { user } = useRecoilValue(authStore);

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const { workspaces, loading } = useAllWorkspaces();

  const handleSwitchWorkspace = (userId?: string, workspaceId?: string) => {
    if (!workspaceId) {
      setWorkspace({});
    } else {
      setWorkspace({ userId, workspaceId });
    }
    navigate("/recipes");
    setIsOpen(false);
  };

  const handleWorkspaceSettings = (workspaceId: string) => {
    navigate(`/workspace/${user?.uid}/${workspaceId}`);
    setIsOpen(false);
  };

  const makeNewWorkspace = async () => {
    const workspaceId = await newWorkspace({ name: "Untitled Workspace" });
    if (workspaceId) {
      handleSwitchWorkspace(user?.uid, workspaceId);
      navigate(`/workspace/${user?.uid}/${workspaceId}`);
      setIsOpen(false);
    }
  };

  const selectedWorkspace = workspaces.find(
    ({ ws }) => ws._id === workspaceId
  )?.ws;

  if (loading || (workspaceId && !selectedWorkspace)) {
    return <Spinner />;
  }

  return (
    <>
      <WorkspaceItem
        workspace={selectedWorkspace}
        onClick={() => setIsOpen(true)}
      />

      {isOpen &&
        createPortal(
          <>
            <div className="ra-dialog ra-card workspace-picker">
              <span className="ra-card-header">
                <h2>Workspaces</h2>
              </span>
              <div className="workspace-picker-options">
                <WorkspaceItem onClick={() => handleSwitchWorkspace()} />
                <div />

                {...workspaces.map(({ uid, ws }) => (
                  <Fragment key={ws._id}>
                    <WorkspaceItem
                      workspace={ws}
                      onClick={() => handleSwitchWorkspace(uid, ws._id)}
                    />
                    {uid === user?.uid && (
                      <Button
                        iconBefore="settings"
                        variant="icon"
                        size="sm"
                        onClick={() => handleWorkspaceSettings(ws._id)}
                      />
                    )}
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
