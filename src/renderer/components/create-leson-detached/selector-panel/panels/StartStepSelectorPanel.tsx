import React, { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import reduxAction from "../../../../redux/reduxAction";
import store, { AppState } from "../../../../redux/stores/renderer";
import pendingReduxAction from "../../../../redux/utils/pendingReduxAction";
import editStepItemsRelativePosition from "../../lesson-utils/editStepItemsRelativePosition";
import updateStep from "../../lesson-utils/updateStep";
import "../index.scss";
import TypeIdSelectorPanel from "../TypeIdSelectorPanel";

// import IconStarStep from "../../../../../assets/svg/start-step.svg";

interface StartStepSelectorPanelProps {
  stepId: string;
}

export default function StartStepSelectorPanel(
  props: StartStepSelectorPanelProps
) {
  const { stepId } = props;

  const { treeSteps } = useSelector((state: AppState) => state.createLessonV2);

  const step = useMemo(() => (stepId ? treeSteps[stepId] : undefined), [
    stepId,
    treeSteps,
  ]);

  const doUpdate = useCallback(
    (val: any) => {
      // hacky hack, we should not use anchor anymore!
      if (val.length > 0 && val[0]?.type == "Image Found") {
        // update step
        // wait for cv update
        // update children items relative positions
        const prevCvResult = store.getState().render.cvResult;
        updateStep({ startWhen: val }, stepId).then((updated) => {
          if (updated) {
            reduxAction(store.dispatch, {
              type: "CREATE_LESSON_V2_SETSTEP",
              arg: { step: updated },
            });
            pendingReduxAction(
              (state) => state.render.cvResult,
              prevCvResult,
              5000
            ).then((state) => {
              // console.log(prevCvResult, state.render.cvResult);
              editStepItemsRelativePosition(
                updated._id,
                prevCvResult,
                state.render.cvResult
              );
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
      ]}
      baseData={step?.startWhen || []}
      callback={doUpdate}
    />
  );
}
