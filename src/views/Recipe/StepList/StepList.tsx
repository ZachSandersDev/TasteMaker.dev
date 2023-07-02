import { useEffect } from "react";
import { v4 as uuid } from "uuid";

import { Step, Recipe, getBlankStep } from "../../../@modules/types/recipes";

import { KeyboardList } from "../../../components/KeyboardList";

import { StepItem } from "../StepList/StepItem";

import "./StepList.scss";

export interface StepListProps {
  steps: Step[];
  editing: boolean;
  updateRecipe?: (updateFunc: (r: Recipe) => void) => void;
}

export function StepList({ steps, editing, updateRecipe }: StepListProps) {
  useEffect(() => {
    if (!steps.length) {
      updateRecipe?.((r) => (r.steps = [getBlankStep()]));
    }
  }, [steps]);

  const reorderSteps = (steps: Step[]) => {
    updateRecipe?.((r) => (r.steps = steps));
  };

  const updateStepText = (index: number, stepText: string) => {
    updateRecipe?.((r) => (r.steps[index].text = stepText));
  };

  const deleteStep = (index: number) => {
    updateRecipe?.((r) => {
      if (r.steps.length === 1) {
        r.steps = [{ ...getBlankStep(), _id: r.steps[0]._id }];
        return;
      }

      r.steps.splice(index, 1);
    });
  };

  const newStep = (at?: number, values?: string[]) => {
    updateRecipe?.((r) => {
      const hasValue = !!at && !!r.steps[at]?.text;

      r.steps.splice(
        at ?? r.steps.length,
        !hasValue ? 1 : 0,
        ...(values
          ? values.map((v) => ({ text: v, _id: uuid() }))
          : [{ text: "", _id: uuid() }])
      );
    });
  };

  if (!editing && !steps.some(({ text }) => !!text)) {
    return null;
  }

  return (
    <div>
      <header className="ra-header">
        <h3>Steps</h3>
      </header>
      <KeyboardList<Step>
        className="step-list"
        values={steps}
        onReorder={reorderSteps}
        onNew={newStep}
        onDelete={deleteStep}
        renderItem={(step, i, { onKeyDown, onPaste }, ref) => (
          <StepItem
            key={step._id}
            step={step}
            index={i}
            onTextChange={(text) => updateStepText(i, text)}
            onDelete={() => deleteStep(i)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            editing={editing}
            ref={ref}
          />
        )}
      />
    </div>
  );
}
