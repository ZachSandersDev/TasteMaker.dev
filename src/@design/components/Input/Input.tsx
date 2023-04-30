import { FocusEvent, forwardRef, ReactElement, useState } from "react";

import classNames from "../../../@modules/utils/classNames";

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
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <div
        className={classNames(
          "ra-input",
          isFocused && "focus",
          props.disabled && "disabled",
          className
        )}
        style={style}
      >
        <input
          className="ra-inner-input"
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {after}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
