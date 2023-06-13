import { Fragment, useState } from "react";

import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import Button from "../@design/components/Button/Button";
import {
  getJoinedWorkspaces,
  getMyWorkspaces,
  getWorkspace,
  newWorkspace,
} from "../@modules/api/workspaces";
import { authStore } from "../@modules/stores/auth";
import { profileStore } from "../@modules/stores/profile";
import { workspaceStore } from "../@modules/stores/workspace";
import { JoinedWorkspace, Workspace } from "../@modules/types/workspaces";

import { useSWR } from "../@modules/utils/cache.react";

import { ProfileImage } from "./ProfileImage";
import Spinner from "./Spinner";

import "./WorkspacePicker.scss";

export default function WorkspacePicker() {
  const [{ workspaceId }, setWorkspace] = useRecoilState(workspaceStore);
  const { user } = useRecoilValue(authStore);
  const { profile } = useRecoilValue(profileStore);

  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();

  const { loading: myWorkspacesLoading, value: myWorkspaces } = useSWR<
    Workspace[]
  >(`${user?.uid}/workspaces`, () => getMyWorkspaces());

  const { value: joinedWorkspaceIds } = useSWR<JoinedWorkspace[]>(
    `${user?.uid}/joinedWorkspaceIds`,
    () => getJoinedWorkspaces()
  );

  const { loading: joinedWorkspacesLoading, value: joinedWorkspaces } = useSWR<
    Workspace[]
  >(`${user?.uid}/joinedWorkspaces`, () => {
    if (!joinedWorkspaceIds) return Promise.resolve([]);
    return Promise.all(
      joinedWorkspaceIds.map((params) => getWorkspace(params))
    ).then((workspaces) => workspaces.filter((w): w is Workspace => !!w));
  });

  const handleSwitchWorkspace = (userId?: string, workspaceId?: string) => {
    if (!workspaceId) {
      setWorkspace({});
    } else {
      setWorkspace({ userId, workspaceId });
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

  if (myWorkspacesLoading || joinedWorkspacesLoading) {
    return <Spinner />;
  }

  if (!myWorkspaces && !joinedWorkspaces) {
    return null;
  }

  const allWorkspaces = [
    ...(myWorkspaces || []).map((ws) => ({
      uid: user?.uid,
      ws,
    })),
    ...(joinedWorkspaces || []).map((ws) => {
      const joinedWorkspaceParams = joinedWorkspaceIds?.find(
        (jws) => jws.workspaceId === ws._id
      );

      return {
        uid: joinedWorkspaceParams?.userId,
        ws,
      };
    }),
  ];

  const selectedWorkspace = allWorkspaces.find(
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
            id={selectedWorkspace?._id}
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

                {...allWorkspaces.map(({ uid, ws }) => (
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
