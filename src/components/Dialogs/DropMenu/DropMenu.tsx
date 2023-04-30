import { useState } from "react";

import Button from "../../../@design/components/Button";

import "./DropMenu.scss";
import DropMenuDialog from "./DropMenuDialog";

export interface DropMenuOption {
  color?: string;
  icon: string;
  text: string;
  value: string;
}

export interface DropMenuProps {
  icon: string;
  onSelect: (value: string) => void;
  options: DropMenuOption[];
}

export default function DropMenu({ icon, onSelect, options }: DropMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    onSelect(value);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="drop-menu-container">
      <Button variant="icon" onClick={handleClick}>
        {icon}
      </Button>

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
