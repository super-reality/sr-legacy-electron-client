import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Item } from "../../../api/types/item/item";
import { IStep } from "../../../api/types/step/step";
import { AppState } from "../../../redux/stores/renderer";
import ItemView from "../item-view";

type ItemsState = Record<string, boolean>;

interface StepPreviewProps {
  stepId: string;
  onSucess: () => void;
}

export default function StepView(props: StepPreviewProps) {
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
      state[i._id] = false;
    });
    console.log("setItemsState", state);
    setItemsState(state);
  }, [step]);

  const itemSuceeded = useCallback(
    (id: string, trigger: number) => {
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
        const item: Item = treeItems[itemId];
        // console.log(item);
        return itemsState[itemId] == false ? (
          <ItemView
            key={item._id}
            item={item}
            anchorId={step.anchor || ""}
            onSucess={(trigger: number) => {
              if (trigger == item.trigger) {
                itemSuceeded(itemId, trigger);
              }
            }}
          />
        ) : (
          <React.Fragment key={item._id} />
        );
      })}
    </>
  );
}
