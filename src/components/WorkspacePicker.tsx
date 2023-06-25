import { Fragment, useState } from "react";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import { deleteInvite } from "../@modules/api/invites";
import {
  WorkspaceRefParams,
  joinWorkspace,
  newWorkspace,
} from "../@modules/api/workspaces";
import {
  useAllWorkspaces,
  useInvitedWorkspaces,
} from "../@modules/hooks/useAllWorkspaces";
import { authStore } from "../@modules/stores/auth";
import { workspaceStore } from "../@modules/stores/workspace";

import { WorkspaceItem } from "./ListItems/WorkspaceItem";
import Spinner from "./Spinner";

import "./WorkspacePicker.scss";

export default function WorkspacePicker() {
  const [{ workspaceId }, setWorkspace] = useRecoilState(workspaceStore);
  const { user } = useRecoilValue(authStore);

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const {
    workspaces,
    loading,
    revalidate: revalidateAllWorkspaces,
  } = useAllWorkspaces();
  const {
    workspaces: invitedWorkspaces,
    revalidate: revalidateInvitedWorkspaces,
  } = useInvitedWorkspaces();

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

  const handleAcceptInvite = async (
    params: WorkspaceRefParams,
    inviteId?: string
  ) => {
    await joinWorkspace(params);
    if (inviteId) await deleteInvite(inviteId);
    revalidateAllWorkspaces();
    revalidateInvitedWorkspaces();
  };

  const handleDeleteInvite = async (inviteId?: string) => {
    if (inviteId) await deleteInvite(inviteId);
    revalidateInvitedWorkspaces();
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

              <div className="workspace-picker-options">
                {!!invitedWorkspaces?.length && (
                  <>
                    <span className="ra-sub-title">My Invites</span>
                    <span />
                  </>
                )}

                {...invitedWorkspaces.map(
                  ({ userId, workspaceId, inviteId, ws }) => (
                    <Fragment key={ws._id}>
                      <WorkspaceItem workspace={ws} disabled />
                      <div className="ra-actions">
                        <Button
                          iconBefore="check"
                          variant="icon"
                          size="sm"
                          onClick={() =>
                            handleAcceptInvite(
                              { userId, workspaceId },
                              inviteId
                            )
                          }
                        />
                        <Button
                          iconBefore="clear"
                          variant="icon"
                          size="sm"
                          color="var(--color-danger)"
                          onClick={() => handleDeleteInvite(inviteId)}
                        />
                      </div>
                    </Fragment>
                  )
                )}
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
