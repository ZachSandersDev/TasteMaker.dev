import { PropsWithChildren } from "react";
import SwipeToDelete from "./Theft/SwipeToDelete";

import "./SwipeDelete.scss";

export interface SwipeDeleteProps extends PropsWithChildren {
  onDelete: () => void;
}

export default function SwipeDelete({ onDelete, children }: SwipeDeleteProps) {
  return (
    <SwipeToDelete className="swipe-delete-container" onDelete={onDelete}>
      <div className="swipe-delete-swipe">{children}</div>
    </SwipeToDelete>
  );
}
