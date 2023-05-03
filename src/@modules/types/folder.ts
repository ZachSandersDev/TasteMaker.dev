export interface Folder {
  _id: string;
  text?: string;
  parent?: string;
  icon?: string;
}

export function setFolderDefaults(folder: Partial<Folder>) {
  const newFolder: Folder = {
    _id: "",
    ...folder
  };

  if (!newFolder.text) delete newFolder.text;
  if (!newFolder.parent) delete newFolder.parent;
  if (!newFolder.icon) delete newFolder.icon;

  return newFolder;
}