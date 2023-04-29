import { Reorder, useDragControls } from "framer-motion";

import { Recipe, Step } from "../../../../@modules/types/recipes";

import ContentEditable from "../../../../components/ContentEditable";
import SwipeToDelete from "../../../../components/SwipeToDelete";

import "./StepItem.scss";

export interface StepItemProps {
  step: Step;
  index: number;
  editing: boolean;
  updateRecipe: (update: (r: Recipe) => unknown) => void;
}

export default function StepItem({
  step,
  index,
  editing,
  updateRecipe,
}: StepItemProps) {
  const controls = useDragControls();

  const setStepText = (value: string) => {
    updateRecipe((r) => (r.steps[index].text = value));
  };

  const deleteStep = () => {
    updateRecipe((r) => r.steps.splice(index, 1));
  };

  if (!editing) {
    return (
      <div className="step-item">
        <span className="step-number">{index + 1}.</span>
        <span>{step.text}</span>
      </div>
    );
  }

  return (
    <Reorder.Item
      className="step-item-wrapper"
      value={step}
      dragListener={false}
      dragControls={controls}
    >
      <SwipeToDelete
        className="ingredient-item-container"
        onDelete={deleteStep}
      >
        <div className="step-item">
          {/* <span className="step-number">{index + 1}.</span> */}
          <div
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </div>
          <ContentEditable
            className="step-input"
            value={step.text}
            onChange={(v) => setStepText(v)}
            plaintext
          />
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
