import { Workspace } from "../@modules/types/workspaces";
import classNames from "../@modules/utils/classNames";

export type WorkspaceItemProps = {
  onClick?: (e: React.MouseEvent) => void;
  workspace: Workspace;
  disabled?: boolean;
};

export const WorkspaceItem = ({
  onClick,
  workspace,
  disabled,
}: WorkspaceItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick && !disabled) onClick(e);
  };

  if (!workspace) {
    return null;
  }

  return (
    <div
      className={classNames("ra-option", disabled && "disabled")}
      onClick={handleClick}
    >
      <span className="ra-option-icon">
        {workspace.image ? (
          <img src={workspace.image.imageUrl} />
        ) : (
          workspace.icon || <i className="material-symbols-rounded">notes</i>
        )}
      </span>
      <span>{workspace.name || "Untitled Workspace"}</span>
    </div>
  );
};
