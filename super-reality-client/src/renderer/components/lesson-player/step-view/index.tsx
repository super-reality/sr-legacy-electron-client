import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Item } from "../../../api/types/item/item";
import { IStep } from "../../../api/types/step/step";
import { AppState } from "../../../redux/stores/renderer";
import ItemView from "../item-view";

type ItemsState = Record<string, boolean>;

interface StepViewProps {
  stepId: string;
  onSucess: () => void;
}

export default function StepView(props: StepViewProps) {
  const { onSucess, stepId } = props;
  const { treeSteps, treeItems } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [itemsState, setItemsState] = useState<ItemsState>({});

  const step: IStep | undefined = useMemo(
    () => treeSteps[stepId] || undefined,
    [treeSteps, stepId]
  );

  useEffect(() => {
    const state: ItemsState = {};
    step.items.forEach((i) => {
      const item: Item | undefined = treeItems[i._id];
      state[i._id] = false;
      if (item && item.trigger == null) {
        state[i._id] = true;
      }
    });
    setItemsState(state);
  }, [step]);

  const itemSuceeded = useCallback(
    (id: string, trigger: number | null) => {
      const state = { ...itemsState };
      state[id] = true;
      setItemsState(state);
      // If all items are TRUE, this step has finished
      // Each item has its own logic defined to know when it can advance on the ../name-box components
      if (Object.keys(state).filter((iid) => state[iid] == false).length == 0) {
        onSucess();
      }
    },
    [itemsState]
  );

  return (
    <>
      {Object.keys(itemsState).map((itemId) => {
        const item: Item | undefined = treeItems[itemId];
        return item && (itemsState[itemId] == false || item.trigger == null) ? (
          <ItemView
            key={item._id}
            item={item}
            anchorId={step.anchor || ""}
            onSucess={(trigger: number | null) => {
              if (trigger == item.trigger) {
                itemSuceeded(itemId, trigger);
              }
            }}
          />
        ) : (
          <React.Fragment key={item?._id || "undef-item"} />
        );
      })}
    </>
  );
}
