import { useRef } from "react";

import { CSSTransition } from "react-transition-group";

import { useRecoilState } from "recoil";
import { setRecoil } from "recoil-nexus";

import { ContextMenuDialog } from "../../@modules/stores/dialogs";
import classNames from "../../@modules/utils/classNames";

import "./ContextMenuDialog.scss";

export interface ContextMenuOption {
  color?: string;
  icon: string;
  text: string;
  onClick: () => void;
}

export interface ContextMenuDialogPayload {
  position: { x: number; y: number };
  options: ContextMenuOption[];
}

export function useContextMenu() {
  return (payload: ContextMenuDialogPayload) =>
    new Promise<void>((resolve, reject) => {
      setRecoil(ContextMenuDialog, { resolve, reject, payload });
    });
}

export function ContextMenuDialogComponent() {
  const [{ resolve, payload }, setDialogState] =
    useRecoilState(ContextMenuDialog);

  const cardRef = useRef<HTMLDivElement>(null);

  const handleSelect = (o: ContextMenuOption) => {
    o.onClick();
    reset();
  };

  const reset = () => {
    resolve?.();
    setDialogState({ payload });
  };

  const { position, options } = payload || {};

  const horiz = (position?.x || 0) > window.innerWidth / 2 ? "right" : "left";

  return (
    <>
      <CSSTransition
        nodeRef={cardRef}
        in={!!resolve}
        timeout={200}
        classNames={"context-menu"}
        onExited={() => {
          setDialogState({});
        }}
      >
        <div
          className="ra-card context-menu"
          style={{
            top: position?.y,
            [horiz]:
              horiz === "right"
                ? window.innerWidth - (position?.x || 0)
                : position?.x,
            transformOrigin: `${horiz} top`,
          }}
          ref={cardRef}
        >
          {options?.map((o) => (
            <button
              key={o.icon + o.text}
              className={classNames("context-menu-item")}
              onClick={() => handleSelect(o)}
              style={{ color: o.color || "" }}
            >
              {o.icon && <i className="material-symbols-rounded">{o.icon}</i>}
              <span>{o.text}</span>
            </button>
          ))}
        </div>
      </CSSTransition>
      {!!resolve && (
        <div className="context-menu ra-dialog-cover" onClick={reset}></div>
      )}
    </>
  );
}
