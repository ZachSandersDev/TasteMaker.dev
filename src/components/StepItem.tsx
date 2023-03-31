import { Reorder, useDragControls } from "framer-motion";
import SwipeToDelete from "react-swipe-to-delete-ios";

import { Recipe, Step } from "../@modules/types/recipes";

import "./StepItem.scss";
import ContentEditable from "./ContentEditable";

export interface StepItemProps {
  step: Step;
  index: number;
  updateRecipe: (update: (r: Recipe) => unknown) => void;
}

export default function StepItem({ step, index, updateRecipe }: StepItemProps) {
  const controls = useDragControls();

  const setStepText = (value: string) => {
    updateRecipe((r) => (r.steps[index].text = value));
  };

  const deleteStep = () => {
    updateRecipe((r) => r.steps.splice(index, 1));
  };

  return (
    <Reorder.Item
      className="step-item"
      value={step}
      dragListener={false}
      dragControls={controls}
    >
      <SwipeToDelete
        className="ingredient-item-container"
        onDelete={deleteStep}
      >
        <div className="step-item">
          <span>{index + 1}.</span>
          <ContentEditable
            className="step-input"
            value={step.text}
            onChange={(v) => setStepText(v)}
          />
          <div
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </div>
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
