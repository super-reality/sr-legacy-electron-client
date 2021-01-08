import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { TypeValue } from "../../../../../types/utils";
import { CanvasTypeValue } from "../../../../api/types/step/step";
import reduxAction from "../../../../redux/reduxAction";
import useStep from "../../hooks/useStep";
import updateStep from "../../lesson-utils/updateStep";
import "../index.scss";
import TypeIdSelectorPanel from "../TypeIdSelectorPanel";

interface CanvasSelectorPanelProps {
  stepId: string;
}

export default function CanvasSelectorPanel(props: CanvasSelectorPanelProps) {
  const { stepId } = props;
  const dispatch = useDispatch();

  const step = useStep(stepId);

  const doUpdate = useCallback(
    (val: TypeValue[]) => {
      updateStep({ canvas: val as CanvasTypeValue[] }, stepId).then(
        (updated) => {
          if (updated) {
            reduxAction(dispatch, {
              type: "CREATE_LESSON_V2_SETSTEP",
              arg: { step: updated },
            });
          }
        }
      );
      // Should update the step with the update canvas key
    },
    [stepId, dispatch]
  );

  return (
    <TypeIdSelectorPanel
      title="Step Canvas"
      single
      types={[
        "Image",
        "Recording",
        "Url",
        "Process",
        "Facial Expression",
        "Browser",
        "GPS",
        "Body Pose",
        "Brainwave",
        "User",
        "Object",
        "Gaze",
        "Sound",
        "Smell",
        "Taste",
        "AI",
        "Organism",
        "Language",
      ]}
      baseData={step?.canvas || []}
      callback={doUpdate}
    />
  );
}
