import { Reorder, useDragControls } from "framer-motion";
import ContentEditable from "react-contenteditable";
import sanitize from "sanitize-html";

import { Recipe, Step } from "../@modules/types/recipes";

import "./StepItem.scss";

export interface StepItemProps {
  step: Step;
  index: number;
  updateRecipe: (update: (r: Recipe) => unknown) => void;
}

export default function StepItem({ step, index, updateRecipe }: StepItemProps) {
  const controls = useDragControls();

  const setStepText = (index: number, value: string) => {
    updateRecipe((r) => (r.steps[index].text = value));
  };

  return (
    <Reorder.Item
      className="step-item"
      value={step}
      dragListener={false}
      dragControls={controls}
    >
      <span>{index + 1}.</span>
      <ContentEditable
        className="ra-input step-input"
        contentEditable
        html={sanitize(step.text)}
        onChange={(e) => setStepText(index, sanitize(e.target.value))}
      />
      <div
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: "none" }}
      >
        <span className="material-symbols-rounded drag-handle">
          drag_indicator
        </span>
      </div>
    </Reorder.Item>
  );
}
