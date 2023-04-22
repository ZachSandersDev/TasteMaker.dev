import { atom, useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import "./DropMenu.scss";

export interface DropMenuOption {
  color?: string;
  icon: string;
  text: string;
  value: string;
}

interface DropMenuDialogState {
  resolve?: (o?: string) => void;
  reject?: (e: Error) => void;
  options?: DropMenuOption[];
}

const dropMenuDialog = atom<DropMenuDialogState>({
  key: "DropMenuDialog",
  default: {},
});

export function getDropMenuSelection(options: DropMenuOption[]) {
  return new Promise<string | undefined>((resolve, reject) => {
    setRecoil(dropMenuDialog, { resolve, reject, options });
  });
}

export default function DropMenuDialog() {
  const [{ resolve, reject, options }, setDialogState] =
    useRecoilState(dropMenuDialog);

  if (!resolve || !reject || !options) {
    return null;
  }

  const res = (o?: string) => {
    if (o) resolve(o);
    setDialogState({});
  };

  return (
    <>
      <div className="ra-card drop-menu">
        {options.map((o) => (
          <button
            key={o.value}
            className="drop-menu-item"
            onClick={() => res(o.value)}
            style={{ color: o.color || "" }}
          >
            {o.icon && <i className="material-symbols-rounded">{o.icon}</i>}
            <span>{o.text}</span>
          </button>
        ))}
      </div>
      <div className="ra-dialog-cover" onClick={() => res()}></div>
    </>
  );
}
