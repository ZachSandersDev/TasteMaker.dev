import { ImageField } from "./imageField";

export interface JoinedWorkspace {
  _id: string;
  userId: string;
  workspaceId: string;
}

export interface Workspace {
  _id: string;
  // ownerId: string;

  name?: string | null;
  icon?: string | null;
  image?: ImageField | null;

  // folders: Record<string, Folder>;
  // recipes: Record<string, Recipe>;
}

export function setWorkspaceDefaults(workspace: Partial<Workspace>) {
  const newWorkspace: Workspace = {
    _id: workspace._id || "",
    // ownerId: workspace.ownerId || "",

    name: workspace.name || null,
    icon: workspace.icon || null,
    image: workspace.image || null,

    // folders: workspace.folders || {},
    // recipes: workspace.recipes || {},
  };

  return newWorkspace;
}