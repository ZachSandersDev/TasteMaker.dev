import { PropsWithChildren, ReactNode } from "react";

import classNames from "../../../@modules/utils/classNames";

import "./Button.scss";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "lg" | "md" | "xm" | "sm";
  variant?: "chip" | "naked" | "naked-chip" | "filled" | "icon";
  before?: ReactNode;
  iconBefore?: string;
  iconAfter?: string;
  gap?: string;
  color?: string;
  noPadding?: boolean;
}

export default function Button({
  size = "md",
  variant = "filled",
  before,
  iconBefore,
  iconAfter,
  color,
  children,
  className,
  noPadding,
  gap,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={classNames(
        "ra-button",
        `ra-button-size-${size}`,
        `ra-button-${variant}`,
        className,
        noPadding && "ra-button-no-padding"
      )}
      style={{ color, gap }}
      {...rest}
    >
      {before && <i className="ra-button-icon-before">{before}</i>}

      {variant !== "icon" && iconBefore && (
        <i className="material-symbols-rounded ra-button-icon-before">
          {iconBefore}
        </i>
      )}

      {variant === "icon" && iconBefore ? (
        <i className="material-symbols-rounded">{iconBefore}</i>
      ) : (
        children
      )}

      {iconAfter && (
        <i className="material-symbols-rounded ra-button-icon-after">
          {iconAfter}
        </i>
      )}
    </button>
  );
}
