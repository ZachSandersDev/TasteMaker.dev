import { useCallback } from "react";
import { useParams } from "react-router-dom";

import Button from "../@design/components/Button/Button";
import MultilineInput from "../@design/components/MultilineInput/MultilineInput";
import { getWorkspace, saveWorkspace } from "../@modules/api/workspaces";
import { Workspace } from "../@modules/types/workspaces";
import useLoader, { LoaderFunc } from "../@modules/utils/useLoader";
import useUpdater from "../@modules/utils/useUpdater";

import AppView from "../components/AppView";
import { getText } from "../components/Dialogs/TextInputDialog";
import Loading from "../components/Loading";

export default function WorkspaceSettings() {
  const { userId, workspaceId } = useParams();

  const workspaceLoader = useCallback<LoaderFunc<Workspace>>(
    (cb) => getWorkspace({ userId, workspaceId }, cb),
    [userId, workspaceId]
  );

  const { data: workspace, setData: setWorkspace } = useLoader<Workspace>(
    workspaceLoader,
    `/workspace/${workspaceId}`
  );

  const updateWorkspace = useUpdater(workspace, (newWorkspace) => {
    setWorkspace(newWorkspace);
    saveWorkspace({ userId, workspaceId }, newWorkspace);
  });

  const handleNewEditor = async () => {
    if (!workspace) return;

    const newMemberEmail = await getText({
      title: "New Member",
      placeholder: "E-Mail",
    });
    if (!newMemberEmail) return;

    updateWorkspace((ws) => ws.editorEmails.push(newMemberEmail));
  };

  const handleRenameWorkspace = (text: string) => {
    updateWorkspace((f) => (f.name = text));
  };

  if (!workspace) {
    return <Loading />;
  }

  return (
    <AppView>
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
          {...workspace.editorEmails.map((email) => (
            <li key={email}>{email}</li>
          ))}
        </ul>

        <div className="ra-actions-left">
          <Button iconBefore="add" size="sm" onClick={handleNewEditor}>
            Add member
          </Button>
        </div>
      </section>

      {/* 
      <div className="profile-image-container">
        <ProfileImage size="lg" onChange={handleNewProfileImage} />
        <MultilineInput
          className="ra-title"
          value={profile?.displayName || ""}
          placeholder="Anonymous User"
          onChange={(name) => updateProfile((p) => (p.displayName = name))}
          variant="naked"
        />
      </div>

      <button
        className="settings-option"
        style={{ color: "var(--color-danger)" }}
        onClick={doLogout}
      >
        Log out
      </button> */}
    </AppView>
  );
}
