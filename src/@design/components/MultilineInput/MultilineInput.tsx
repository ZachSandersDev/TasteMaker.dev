import { forwardRef } from "react";

import classNames from "../../../@modules/utils/classNames";

import "./MultilineInput.scss";
import "../Input/Input.scss";

export interface MultilineInputProps {
  className?: string;
  value: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
  variant?: "filled" | "naked";
}

export const MultilineInput = forwardRef<
  HTMLTextAreaElement,
  MultilineInputProps
>(
  (
    {
      className,
      value,
      placeholder,
      onChange,
      onKeyDown,
      onKeyUp,
      disabled,
      variant = "filled",
    },
    ref
  ) => {
    return (
      <div
        className={classNames(
          "multiline-input",
          disabled && "disabled",
          variant,
          className
        )}
        data-replicated-value={value}
      >
        <textarea
          rows={1}
          className={className}
          placeholder={placeholder}
          value={value}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          ref={ref}
        />
      </div>
    );
  }
);

MultilineInput.displayName = "MultilineInput";
export default MultilineInput;