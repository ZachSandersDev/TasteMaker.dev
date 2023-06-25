import { ImageField } from "./imageField";

export interface JoinedWorkspace {
  _id: string;
  userId: string;
  workspaceId: string;
}

export interface Workspace {
  _id: string;

  name?: string | null;
  icon?: string | null;
  image?: ImageField | null;

  members?: Record<string, boolean>;
}

export function setWorkspaceDefaults(workspace: Partial<Workspace>) {
  const newWorkspace: Workspace = {
    _id: workspace._id || "",

    name: workspace.name || null,
    icon: workspace.icon || null,
    image: workspace.image || null,

    members: workspace.members || {},
  };

  return newWorkspace;
}
