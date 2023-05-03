import {
  ContentEditableEvent,
  default as ReactContentEditable,
} from "react-contenteditable";
import sanitize from "sanitize-html";

import classNames from "../../../@modules/utils/classNames";

import "./ContentEditable.scss";
import "../Input/Input.scss";

export interface ContentEditableProps {
  className?: string;
  value: string;
  placeholder?: string;
  onChange: (newValue: string) => void;
  disabled?: boolean;
  naked?: boolean;
  noborder?: boolean;
  plaintext?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onKeyUp?: (e: React.KeyboardEvent) => void;
}

// https://stephenhaney.com/2020/get-contenteditable-plaintext-with-correct-linebreaks/
function parseHTMLIntoPlainText(value: string) {
  let newValue = "";
  let isOnFreshLine = true;

  function parseChildNodesForValueAndLines(childNodes: NodeListOf<ChildNode>) {
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];

      if (childNode.nodeName === "BR") {
        // BRs are always line breaks which means the next loop is on a fresh line
        newValue += "\n";
        isOnFreshLine = true;
        continue;
      }

      // We may or may not need to create a new line
      if (childNode.nodeName === "DIV" && isOnFreshLine === false) {
        // Divs create new lines for themselves if they aren't already on one
        newValue += "\n";
      }

      // Whether we created a new line or not, we'll use it for this content so the next loop will not be on a fresh line:
      isOnFreshLine = false;

      // Add the text content if this is a text node:
      if (childNode.nodeType === 3 && childNode.textContent) {
        newValue += childNode.textContent;
      }

      // If this node has children, get into them as well:
      parseChildNodesForValueAndLines(childNode.childNodes);
    }
  }

  const div = document.createElement("div");
  div.innerHTML = value;
  parseChildNodesForValueAndLines(div.childNodes);
  return newValue;
}

export default function ContentEditable({
  className,
  value,
  placeholder,
  onChange,
  onKeyDown,
  onKeyUp,
  disabled,
  naked,
  noborder,
  plaintext,
}: ContentEditableProps) {
  const handleChange = (e: ContentEditableEvent) => {
    if (plaintext) {
      onChange(
        sanitize(parseHTMLIntoPlainText(e.target.value), {
          allowedTags: ["br"],
          allowedAttributes: {},
        })
      );
    } else {
      onChange(sanitize(e.target.value));
    }
  };

  return (
    <ReactContentEditable
      placeholder={placeholder}
      className={classNames(
        "content-editable",
        naked ? "content-editable-naked" : "ra-input",
        disabled && "disabled",
        plaintext && "plain",
        noborder && "noborder",
        className
      )}
      html={sanitize(value).replaceAll("\n", "<br/>")}
      onChange={handleChange}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      disabled={disabled}
    />
  );
}
