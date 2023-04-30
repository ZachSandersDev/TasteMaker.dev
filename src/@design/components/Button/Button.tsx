import { PropsWithChildren } from "react";

import classNames from "../../../@modules/utils/classNames";

import "./Button.scss";

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: "lg" | "md" | "sm";
  variant?: "chip" | "naked" | "filled" | "icon";
  iconBefore?: string;
  iconAfter?: string;
  color?: string;
}

export default function Button({
  size = "md",
  variant = "filled",
  iconBefore,
  iconAfter,
  color,
  children,
  className,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={classNames(
        "ra-button",
        `ra-button-size-${size}`,
        `ra-button-${variant}`,
        className
      )}
      style={{ color }}
      {...rest}
    >
      {iconBefore && (
        <i className="material-symbols-rounded ra-button-icon-before">
          {iconBefore}
        </i>
      )}

      {variant === "icon" ? (
        <i className="material-symbols-rounded">{children}</i>
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
