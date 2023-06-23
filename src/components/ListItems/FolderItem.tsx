import Button from "../../@design/components/Button/Button";
import { Folder } from "../../@modules/types/folder";
import classNames from "../../@modules/utils/classNames";

import "./ListItem.scss";

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
    <Button
      gap="calc(var(--spacing) * 1.5)"
      variant="naked"
      className={classNames("list-option", className)}
      onClick={onClick}
      iconBefore={icon || "folder"}
    >
      {text}
    </Button>
  );
};
