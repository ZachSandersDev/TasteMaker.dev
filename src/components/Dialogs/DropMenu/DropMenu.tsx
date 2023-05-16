import { useState } from "react";

import Button from "../../../@design/components/Button/Button";

import "./DropMenu.scss";
import DropMenuDialog from "./DropMenuDialog";

export interface DropMenuOption {
  color?: string;
  icon: string;
  text: string;
  onClick: () => void;
}

export interface DropMenuProps {
  options: DropMenuOption[];
}

export default function DropMenu({ options }: DropMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: DropMenuOption) => {
    option.onClick();
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="drop-menu-container">
      <Button variant="icon" onClick={handleClick} iconBefore="more_horiz" />

      {isOpen && (
        <DropMenuDialog
          options={options}
          onSelect={handleSelect}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
