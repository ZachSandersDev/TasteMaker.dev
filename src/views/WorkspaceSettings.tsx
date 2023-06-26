import { useNavigate, useParams } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";

import Button from "../@design/components/Button/Button";
import MultilineInput from "../@design/components/MultilineInput/MultilineInput";
import { deleteImage, uploadIconImage } from "../@modules/api/files";
import { sendInvite } from "../@modules/api/invites";
import {
  deleteWorkspace,
  getWorkspace,
  saveWorkspace,
} from "../@modules/api/workspaces";
import { useProfiles } from "../@modules/hooks/profile";
import { authStore } from "../@modules/stores/auth";
import { profileStore } from "../@modules/stores/profile";
import { workspaceStore } from "../@modules/stores/workspace";
import { Workspace } from "../@modules/types/workspaces";
import { useSWR } from "../@modules/utils/cache.react";

import DropMenu from "../components/Dialogs/DropMenu/DropMenu";
import { usePickIcon } from "../components/Dialogs/IconPickerDialog";
import { useInviteUser } from "../components/Dialogs/InviteUserDialog";
import AppHeader from "../components/Global/AppHeader";
import AppView from "../components/Global/AppView";
import { ProfileItem } from "../components/ListItems/ProfileItem";
import Loading from "../components/Loading";
import { ProfileImage } from "../components/ProfileImage";

export default function WorkspaceSettings() {
  const { userId, workspaceId } = useParams();
  const { user } = useRecoilValue(authStore);
  const { profile } = useRecoilValue(profileStore);
  const setWorkspace = useSetRecoilState(workspaceStore);
  const navigate = useNavigate();
  const pickIcon = usePickIcon();
  const inviteUser = useInviteUser();

  const { value: workspace, updateValue: updateWorkspace } = useSWR<Workspace>(
    `${userId}/${workspaceId}/workspaces/${workspaceId}`,
    () => getWorkspace({ userId, workspaceId }),
    (w) => saveWorkspace({ userId, workspaceId }, w)
  );

  const { profiles } = useProfiles(Object.keys(workspace?.members || {}));

  const handleNewEditor = async () => {
    if (!workspace || !workspaceId) return;

    const newMemberId = await inviteUser({
      title: "New Member",
      placeholder: "E-Mail",
    });
    if (!newMemberId) return;

    sendInvite(newMemberId, workspaceId);
    updateWorkspace((w) => {
      if (!w.members) w.members = {};
      w.members[newMemberId] = true;
    });
  };

  const handleRenameWorkspace = (text: string) => {
    updateWorkspace((f) => (f.name = text));
  };

  const handlePickIcon = async () => {
    if (!workspace) return;

    const { deleted, newEmoji, newImage } =
      (await pickIcon({
        title: "Workspace Icon",
        emojiValue: workspace.icon,
        imageValue: workspace.image,
      })) || {};

    // If we chose nothing, do nothing
    if (!deleted && !newEmoji && !newImage) return;

    // Delete existing image if need be
    if (workspace?.image?.imageId) {
      deleteImage(workspace.image.imageId);
    }

    // New image file was uploaded
    if (newImage) {
      const newIconImage = await uploadIconImage(newImage);
      updateWorkspace((r) => {
        r.image = newIconImage;
        r.icon = undefined;
      });
    }

    // Icon was deleted or an emoji was selected
    else {
      updateWorkspace((r) => {
        if (deleted) {
          r.icon = undefined;
          r.image = undefined;
        }

        if (newEmoji) {
          r.icon = newEmoji;
        }
      });
    }
  };

  const handleDeleteWorkspace = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workspace?"
    );
    if (!confirmed) return;

    deleteWorkspace({ userId, workspaceId });

    navigate("/recipes");
    setWorkspace({});
  };

  if (!workspace) {
    return <Loading />;
  }

  return (
    <AppView
      header={
        <AppHeader subView={true}>
          <div className="ra-actions">
            <DropMenu
              options={[
                {
                  onClick: handleDeleteWorkspace,
                  text: "Delete Workspace",
                  icon: "delete",
                },
              ]}
            />
          </div>
        </AppHeader>
      }
    >
      <header className="ra-header">
        <ProfileImage
          emoji={workspace.icon}
          imageUrl={workspace.image?.imageUrl}
          id={workspace._id}
          onClick={handlePickIcon}
        />
        <MultilineInput
          className="ra-title"
          value={workspace.name || ""}
          placeholder="Untitled Workspace"
          onChange={handleRenameWorkspace}
          variant="naked"
        />
      </header>

      <section>
        <header className="ra-header">
          <h3>Members</h3>
        </header>

        <div className="ra-list">
          <ProfileItem userId={user?.uid} profile={profile} disabled />
          {profiles?.map(({ userId, profile }, i) => (
            <ProfileItem key={i} userId={userId} profile={profile} disabled />
          ))}
        </div>

        <div className="ra-actions-left">
          <Button iconBefore="add" size="sm" onClick={handleNewEditor}>
            Add member
          </Button>
        </div>
      </section>
    </AppView>
  );
}
