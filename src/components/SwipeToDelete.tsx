import React from "react";

import Button from "../@design/components/Button/Button";
import classNames from "../@modules/utils/classNames";
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
    <div
      className={classNames(
        "swipe-to-delete-container",
        className,
        isMobile && "mobile"
      )}
    >
      <div className="swipe-to-delete-child" onClick={onClick}>
        {children}
      </div>

      {isMobile && (
        <Button className="swipe-to-delete-button" onClick={onDelete}>
          Delete
        </Button>
      )}
    </div>
  );
}
