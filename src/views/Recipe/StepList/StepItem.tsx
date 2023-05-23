import { Reorder, useDragControls } from "framer-motion";

import MultilineInput from "../../../@design/components/MultilineInput/MultilineInput";
import { Recipe, Step } from "../../../@modules/types/recipes";

import SwipeToDelete from "../../../components/SwipeToDelete";

import "./StepItem.scss";

export interface StepItemProps {
  step: Step;
  index: number;
  editing: boolean;
  updateRecipe?: (update: (r: Recipe) => unknown) => void;
}

export default function StepItem({
  step,
  index,
  editing,
  updateRecipe,
}: StepItemProps) {
  const controls = useDragControls();

  const setStepText = (value: string) => {
    updateRecipe?.((r) => (r.steps[index].text = value));
  };

  const deleteStep = () => {
    updateRecipe?.((r) => r.steps.splice(index, 1));
  };

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
    >
      <SwipeToDelete onDelete={deleteStep} editing={editing}>
        <div className="step-item">
          <div
            onPointerDown={(e) => controls.start(e)}
            style={{ touchAction: "none" }}
            className="material-symbols-rounded drag-handle"
          >
            drag_indicator
          </div>
          <MultilineInput
            placeholder={`Step ${index + 1}`}
            className="step-input"
            value={step.text}
            onChange={(v) => setStepText(v)}
          />
        </div>
      </SwipeToDelete>
    </Reorder.Item>
  );
}
