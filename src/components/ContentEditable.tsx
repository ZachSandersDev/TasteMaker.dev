import sanitize from "sanitize-html";
import { default as ReactContentEditable } from "react-contenteditable";

import "./ContentEditable.scss";

export interface ContentEditableProps {
  className?: string;
  value: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
  naked?: boolean;
}

export default function ContentEditable({
  className,
  value,
  placeholder,
  onChange,
  naked,
}: ContentEditableProps) {
  return (
    <ReactContentEditable
      placeholder={placeholder}
      className={[
        "content-editable",
        naked ? "content-editable-naked" : "ra-input",
        className,
      ]
        .filter((s) => !!s)
        .join(" ")}
      html={sanitize(value)}
      onChange={(e) => onChange(sanitize(e.target.value))}
    />
  );
}
