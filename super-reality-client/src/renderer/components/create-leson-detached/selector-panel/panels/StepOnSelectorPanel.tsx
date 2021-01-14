import React, { useCallback } from "react";
import { Item } from "../../../../items/item";
import reduxAction from "../../../../redux/reduxAction";
import store from "../../../../redux/stores/renderer";
import useItem from "../../hooks/useItem";
import updateItem from "../../lesson-utils/updateItem";
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
      updateItem({ endOn: val }, itemId).then((updated: unknown) => {
        if (updated) {
          reduxAction(store.dispatch, {
            type: "CREATE_LESSON_V2_SETITEM",
            arg: { item: updated as Item },
          });
        }
      });
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
