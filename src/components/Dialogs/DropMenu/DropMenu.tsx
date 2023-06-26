import { ReactElement } from "react";

import Button from "../../../@design/components/Button/Button";
import { useContextMenu } from "../ContextMenuDialog";

import "./DropMenu.scss";

export interface DropMenuOption {
  color?: string;
  icon: string;
  text: string;
  onClick: () => void;
}

export interface DropMenuProps {
  options: DropMenuOption[];
  icon?: string;
  buttonContent?: ReactElement;
}

export default function DropMenu({
  options,
  icon,
  buttonContent,
}: DropMenuProps) {
  const contextMenu = useContextMenu();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const rect = target.getBoundingClientRect();

    contextMenu({
      position: {
        x: rect.right,
        y: rect.bottom,
      },
      options,
    });
  };

  return (
    <div className="drop-menu-container">
      {buttonContent ? (
        <Button variant="naked" onClick={handleClick}>
          {buttonContent}
        </Button>
      ) : (
        <Button
          variant="icon"
          onClick={handleClick}
          iconBefore={icon || "more_horiz"}
        />
      )}
    </div>
  );
}
