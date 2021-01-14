import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import reduxAction from "../../../../redux/reduxAction";
import store, { AppState } from "../../../../redux/stores/renderer";
import updateStep from "../../lesson-utils/updateStep";
import "../index.scss";
import TypeIdSelectorPanel from "../TypeIdSelectorPanel";

// import IconStarStep from "../../../../../assets/svg/start-step.svg";

interface CanvasSelectorPanelProps {
  stepId: string;
}

export default function CanvasSelectorPanel(props: CanvasSelectorPanelProps) {
  const { stepId } = props;

  const { treeSteps } = useSelector((state: AppState) => state.createLessonV2);

  const step = useMemo(() => (stepId ? treeSteps[stepId] : undefined), [
    stepId,
    treeSteps,
  ]);

  const doUpdate = useCallback(
    (val: any) => {
      // hacky hack, we should not use anchor anymore!
      if (val[0]?.type == "Image Found") {
        updateStep({ anchor: val[0]?.value }, stepId).then((updated) => {
          if (updated) {
            reduxAction(store.dispatch, {
              type: "CREATE_LESSON_V2_SETSTEP",
              arg: { step: updated },
            });
          }
        });
      }
    },
    [stepId]
  );

  return (
    <TypeIdSelectorPanel
      title="Start Step When"
      single
      showActive
      types={[
        "Image Found",
        "Video Found",
        "Process Found",
        "Text Found",
        "Object Found",
        "GPS Found",
        "Expression Found",
      ]}
      baseData={
        step?.anchor
          ? [
              {
                type: "Image Found",
                value: step.anchor,
              },
            ]
          : []
      }
      callback={doUpdate}
    />
  );
}
