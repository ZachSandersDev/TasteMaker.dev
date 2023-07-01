import { Reorder } from "framer-motion";

import { ClipboardEvent, KeyboardEvent, useEffect, useRef } from "react";

import classNames from "../@modules/utils/classNames";

export interface KeyboardListProps<T> {
  values: T[];
  className?: string;
  onNew: (at?: number, values?: string[]) => void;
  onDelete: (index: number) => void;
  onReorder: (newValues: T[]) => void;
  renderItem: (
    value: T,
    index: number,
    props: {
      onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
      onPaste: (e: ClipboardEvent) => void;
    },
    ref: (ref: HTMLTextAreaElement | null) => void
  ) => JSX.Element;
}

export function KeyboardList<T>({
  values,
  className,
  onReorder,
  onNew,
  onDelete,
  renderItem,
}: KeyboardListProps<T>) {
  const editorRefs = useRef<(HTMLTextAreaElement | null)[]>([]);
  const nextTickFocus = useRef<number | null>(null);

  const handleKeyDown = (
    e: KeyboardEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onNew(index + 1);
      nextTickFocus.current = index + 1;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      editorRefs.current[index + 1]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      editorRefs.current[index - 1]?.focus();
    } else if (
      e.key === "Backspace" &&
      !(e.target as HTMLTextAreaElement).value
    ) {
      e.preventDefault();
      onDelete(index);

      if (index > 0) {
        nextTickFocus.current = index - 1;
      } else {
        nextTickFocus.current = index;
      }
    }
  };

  const handlePaste = (e: ClipboardEvent, index: number) => {
    const text = e.clipboardData?.getData("text/plain");
    if (!text) {
      return;
    }

    const lines = text
      .split(/\r?\n/g)
      .map((t) => t.replaceAll("•", "").trim())
      .filter((t) => !!t);

    if (lines.length <= 1) {
      return;
    }

    e.preventDefault();
    onNew(index, lines);
  };

  useEffect(() => {
    if (nextTickFocus.current !== null) {
      editorRefs.current[nextTickFocus.current]?.focus();
      nextTickFocus.current = null;
    }
  });

  return (
    <Reorder.Group
      className={classNames("ra-list", className)}
      axis="y"
      as="div"
      values={values}
      onReorder={onReorder}
    >
      {values.map((value, index) =>
        renderItem(
          value,
          index,
          {
            onKeyDown: (e) => handleKeyDown(e, index),
            onPaste: (e) => handlePaste(e, index),
          },
          (el) => (editorRefs.current[index] = el)
        )
      )}
    </Reorder.Group>
  );
}
