import { DropMenuOption } from "./DropMenu";

export interface DropMenuDialogProps {
  options: DropMenuOption[];
  onSelect: (value: string) => void;
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
            key={o.value}
            className="drop-menu-item"
            onClick={() => onSelect(o.value)}
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
