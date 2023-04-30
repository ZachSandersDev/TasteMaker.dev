import React from "react";

import Button from "../@design/components/Button/Button";
import useMediaQuery from "../@modules/utils/useMediaQuery";
import "./SwipeToDelete.scss";

export interface SwipeToDeleteProps {
  onDelete: () => void;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function SwipeToDelete({
  onDelete,
  onClick,
  className = "",
  children,
}: SwipeToDeleteProps) {
  const isMobile = useMediaQuery("(max-width: 1000px)");

  return (
    <div className={`swipe-to-delete-container ${className}`}>
      <div className="swipe-to-delete-child" onClick={onClick}>
        {children}
      </div>

      {isMobile ? (
        <Button className="swipe-to-delete-button" onClick={onDelete}>
          Delete
        </Button>
      ) : (
        <Button
          className="swipe-to-delete-button"
          onClick={onDelete}
          variant="icon"
          size="sm"
          color="var(--color-danger)"
        >
          clear
        </Button>
      )}
    </div>
  );
}
