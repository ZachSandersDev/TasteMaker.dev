import { DragControls } from "framer-motion";
import { useRef } from "react";

import { ContextMenuOption, useContextMenu } from "./Dialogs/ContextMenuDialog";

export interface DragHandleProps {
  controls: DragControls;
  options?: ContextMenuOption[];
}

export function DragHandle({ controls, options = [] }: DragHandleProps) {
  const dragStart = useRef<number>();
  const contextMenu = useContextMenu();

  return (
    <span
      onPointerDown={(e) => {
        dragStart.current = e.pageY;
        controls.start(e);
      }}
      style={{ touchAction: "none" }}
      className="material-symbols-rounded drag-handle"
      onClick={(e) => {
        if (!options.length) return;

        if (!dragStart.current || Math.abs(e.pageY - dragStart.current) < 10) {
          const div = e.target as HTMLDivElement;
          const rect = div.getBoundingClientRect();

          contextMenu({
            position: { x: rect.left, y: rect.bottom },
            options,
          });
        }
      }}
    >
      drag_indicator
    </span>
  );
}
