import { Reorder, useDragControls } from "framer-motion";

import { KeyboardEvent, forwardRef } from "react";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { Step } from "../../../@modules/types/recipes";

import classNames from "../../../@modules/utils/classNames";
import { DragHandle } from "../../../components/DragHandle";
import SwipeToDelete from "../../../components/SwipeToDelete";

import "./StepItem.scss";

export interface StepItemProps {
  step: Step;
  index: number;
  editing: boolean;
  onTextChange: (value: string) => void;
  onDelete: () => void;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const StepItem = forwardRef<HTMLTextAreaElement, StepItemProps>(
  (
    { step, index, editing, onTextChange, onDelete, onKeyDown }: StepItemProps,
    ref
  ) => {
    const controls = useDragControls();

    if (!editing) {
      return (
        <div className="step-item">
          <span className="step-number">{index + 1}.</span>
          <span style={{ whiteSpace: "pre-wrap" }}>{step.text}</span>
        </div>
      );
    }

    return (
      <Reorder.Item
        className="step-item-wrapper"
        value={step}
        dragListener={false}
        dragControls={controls}
        as="div"
      >
        <SwipeToDelete onDelete={onDelete}>
          <div
            className={classNames("step-item", editing && "step-item-editing")}
          >
            <DragHandle
              controls={controls}
              options={[
                {
                  text: "Delete",
                  icon: "delete",
                  onClick: onDelete,
                },
              ]}
            />

            <MultilineInput
              placeholder={`Step ${index + 1}`}
              className="step-input"
              variant="naked"
              value={step.text}
              onChange={onTextChange}
              onKeyDown={onKeyDown}
              ref={ref}
            />
          </div>
        </SwipeToDelete>
      </Reorder.Item>
    );
  }
);

StepItem.displayName = "StepItem";
