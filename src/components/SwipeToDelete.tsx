import React from "react";
import "./SwipeToDelete.scss";

export interface SwipeToDeleteProps {
  onDelete: () => void;
  onClick?: () => void;
  deleteComponent?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export default function SwipeToDelete({
  onDelete,
  onClick,
  deleteComponent,
  className = "",
  children,
}: SwipeToDeleteProps) {
  return (
    <div className={`swipe-to-delete-container ${className}`}>
      <div className="swipe-to-delete-child" onClick={onClick}>
        {children}
      </div>
      <button className="swipe-to-delete-button" onClick={onDelete}>
        {deleteComponent ? deleteComponent : "Delete"}
      </button>
    </div>
  );
}
