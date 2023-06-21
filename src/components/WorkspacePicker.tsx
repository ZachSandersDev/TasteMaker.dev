import { Fragment, useState } from "react";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import { newWorkspace } from "../@modules/api/workspaces";
import { useAllWorkspaces } from "../@modules/hooks/useAllWorkspaces";
import { authStore } from "../@modules/stores/auth";
import { profileStore } from "../@modules/stores/profile";
import { workspaceStore } from "../@modules/stores/workspace";

import { ProfileImage } from "./ProfileImage";
import Spinner from "./Spinner";

import "./WorkspacePicker.scss";

export default function WorkspacePicker() {
  const [{ workspaceId }, setWorkspace] = useRecoilState(workspaceStore);
  const { user } = useRecoilValue(authStore);
  const { profile } = useRecoilValue(profileStore);

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

  if (loading) {
    return <Spinner />;
  }

  const selectedWorkspace = workspaces.find(
    ({ ws }) => ws._id === workspaceId
  )?.ws;

  return (
    <>
      <Button
        className="workspace-picker-button"
        variant="naked"
        before={
          <ProfileImage
            size="sm"
            emoji={selectedWorkspace?.icon}
            imageUrl={
              selectedWorkspace
                ? selectedWorkspace.image?.imageUrl
                : profile?.image?.imageUrl
            }
            id={selectedWorkspace?._id || user?.uid}
          />
        }
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
                  before={
                    <ProfileImage
                      size="sm"
                      imageUrl={profile?.image?.imageUrl}
                      id={user?.uid}
                    />
                  }
                  variant="naked"
                  onClick={() => handleSwitchWorkspace()}
                >
                  Personal Workspace
                </Button>
                <div />

                {...workspaces.map(({ uid, ws }) => (
                  <Fragment key={ws._id}>
                    <Button
                      before={
                        <ProfileImage
                          size="sm"
                          emoji={ws?.icon}
                          imageUrl={ws?.image?.imageUrl}
                          id={ws._id}
                        />
                      }
                      variant="naked"
                      onClick={() => handleSwitchWorkspace(uid, ws._id)}
                    >
                      {ws.name || "Untitled Workspace"}
                    </Button>
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
