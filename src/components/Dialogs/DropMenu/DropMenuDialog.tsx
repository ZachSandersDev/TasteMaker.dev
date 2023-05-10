import { DropMenuOption } from "./DropMenu";

export interface DropMenuDialogProps {
  options: DropMenuOption[];
  onSelect: (option: DropMenuOption) => void;
  onClose: () => void;
}

export default function DropMenuDialog({
  options,
  onSelect,
  onClose,
}: DropMenuDialogProps) {
  return (
    <>
      <div className="ra-card drop-menu">
        {options.map((o) => (
          <button
            key={o.icon + o.text}
            className="drop-menu-item"
            onClick={() => onSelect(o)}
            style={{ color: o.color || "" }}
          >
            {o.icon && <i className="material-symbols-rounded">{o.icon}</i>}
            <span>{o.text}</span>
          </button>
        ))}
      </div>
      <div className="ra-dialog-cover" onClick={onClose}></div>
    </>
  );
}
