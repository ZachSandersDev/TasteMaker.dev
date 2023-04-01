import { useState } from "react";

import "./DropMenu.scss";

export interface DropMenuProps {
  icon: string;
  options: { color?: string; icon: string; text: string; value: string }[];
  onSelect: (optionSelected: string) => void;
}

export default function DropMenu({ icon, options, onSelect }: DropMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="drop-menu-container">
        <button
          className="material-symbols-rounded icon-button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {icon}
        </button>
        {isOpen && (
          <div className="ra-card drop-menu">
            {options.map((o) => (
              <button
                key={o.value}
                className="drop-menu-item"
                onClick={() => {
                  onSelect(o.value);
                  setIsOpen(false);
                }}
                style={{ color: o.color || "" }}
              >
                {o.icon && <i className="material-symbols-rounded">{o.icon}</i>}
                <span>{o.text}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="drop-menu-cover" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  );
}
