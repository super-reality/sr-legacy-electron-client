import React, { useCallback } from "react";
import reduxAction from "../../../../redux/reduxAction";
import store from "../../../../redux/stores/renderer";
import useItem from "../../hooks/useItem";
import updateStep from "../../lesson-utils/updateStep";
import "../index.scss";
import TypeIdSelectorPanel from "../TypeIdSelectorPanel";

// import IconStarStep from "../../../../../assets/svg/start-step.svg";

interface StepOnSelectorPanelProps {
  itemId: string;
}

export default function StepOnSelectorPanel(props: StepOnSelectorPanelProps) {
  const { itemId } = props;

  const item = useItem(itemId);

  const doUpdate = useCallback(
    (val: any) => {
      // hacky hack, we should not use anchor anymore!
      if (val[0]?.type == "Image Found") {
        updateStep({ anchor: val[0]?.value }, itemId).then((updated) => {
          if (updated) {
            reduxAction(store.dispatch, {
              type: "CREATE_LESSON_V2_SETSTEP",
              arg: { step: updated },
            });
          }
        });
      }
    },
    [itemId]
  );

  return (
    <TypeIdSelectorPanel
      title="End Step On"
      single={false}
      showActive
      types={["Mouse", "Gaze", "Keyboard"]}
      baseData={item?.endOn ?? []}
      callback={doUpdate}
    />
  );
}
