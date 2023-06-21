import { useNavigate, useParams } from "react-router-dom";

import { useSetRecoilState } from "recoil";

import Button from "../@design/components/Button/Button";
import MultilineInput from "../@design/components/MultilineInput/MultilineInput";
import { deleteImage, uploadIconImage } from "../@modules/api/files";
import {
  deleteWorkspace,
  getWorkspace,
  saveWorkspace,
} from "../@modules/api/workspaces";
import { workspaceStore } from "../@modules/stores/workspace";
import { Workspace } from "../@modules/types/workspaces";
import { useSWR } from "../@modules/utils/cache.react";

import AppHeader from "../components/AppHeader";
import AppView from "../components/AppView";
import DropMenu from "../components/Dialogs/DropMenu/DropMenu";
import { usePickIcon } from "../components/Dialogs/IconPickerDialog";
import { useGetText } from "../components/Dialogs/TextInputDialog";
import Loading from "../components/Loading";
import { ProfileImage } from "../components/ProfileImage";

export default function WorkspaceSettings() {
  const { userId, workspaceId } = useParams();
  const setWorkspace = useSetRecoilState(workspaceStore);
  const navigate = useNavigate();
  const pickIcon = usePickIcon();
  const getText = useGetText();

  const { value: workspace, updateValue: updateWorkspace } = useSWR<Workspace>(
    `${userId}/${workspaceId}/workspaces/${workspaceId}`,
    () => getWorkspace({ userId, workspaceId }),
    (w) => saveWorkspace({ userId, workspaceId }, w)
  );

  const handleNewEditor = async () => {
    if (!workspace) return;

    const newMemberEmail = await getText({
      title: "New Member",
      placeholder: "E-Mail",
    });
    if (!newMemberEmail) return;

    updateWorkspace(
      (ws) => (ws.editorEmails[newMemberEmail.replace(".", ",")] = true)
    );
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
      noNav
    >
      <header className="ra-header">
        <ProfileImage
          emoji={workspace.icon}
          imageUrl={workspace.image?.imageUrl}
          id={workspace._id}
          onClick={handlePickIcon}
        />
      </header>
      <header className="ra-header">
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

        <ul className="ra-padded-list">
          <li>You</li>
          {...Object.keys(workspace.editorEmails).map((email) => (
            <li key={email}>{email.replace(",", ".")}</li>
          ))}
        </ul>

        <div className="ra-actions-left">
          <Button iconBefore="add" size="sm" onClick={handleNewEditor}>
            Add member
          </Button>
        </div>
      </section>
    </AppView>
  );
}
