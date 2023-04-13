import { forwardRef, ReactElement } from "react";

import classNames from "../@modules/utils/classNames";

import "./Input.scss";

export interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  after?: ReactElement;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ after, className, style, ...props }, ref) => {
    return (
      <div
        className={classNames("input-wrapper ra-input", className)}
        style={style}
      >
        <input className="input-naked" ref={ref} {...props} />
        {after}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
