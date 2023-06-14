import { Folder } from "../@modules/types/folder";
import classNames from "../@modules/utils/classNames";

export type FolderItemProps = {
  className?: string;
  folder: Folder;
  onClick: () => void;
};

export const FolderItem = ({
  className,
  folder: { text, icon },
  onClick,
}: FolderItemProps) => {
  return (
    <div className={classNames("ra-option", className)} onClick={onClick}>
      <span className="ra-option-icon">
        {icon || <i className="material-symbols-rounded">folder</i>}
      </span>
      <span>{text}</span>
    </div>
  );
};
