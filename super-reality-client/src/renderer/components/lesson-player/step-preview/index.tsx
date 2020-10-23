import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IStep } from "../../../api/types/step/step";
import { AppState } from "../../../redux/stores/renderer";
import ItemView from "../item-view";

type ItemsState = Record<string, boolean>;

interface StepPreviewProps {
  onSucess: () => void;
}

export default function StepPreview(props: StepPreviewProps) {
  const { onSucess } = props;
  const { treeCurrentId, treeSteps, treeItems } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [itemsState, setItemsState] = useState<ItemsState>({});

  const step: IStep | undefined = useMemo(
    () => treeSteps[treeCurrentId] || undefined,
    [treeSteps, treeCurrentId]
  );

  useEffect(() => {
    const state: ItemsState = {};
    step.items.forEach((i) => {
      state[i._id] = false;
    });
    setItemsState(state);
  }, [step]);

  const itemSuceeded = useCallback(
    (id: string) => {
      const state = { ...itemsState };
      state[id] = true;
      setItemsState(state);
      // If all items are TRUE, this step has finished
      if (Object.keys(state).filter((iid) => state[iid] == false).length == 0) {
        onSucess();
      }
    },
    [itemsState]
  );

  return (
    <>
      {Object.keys(itemsState).map((itemId) => {
        const item = treeItems[itemId];
        return itemsState[itemId] ? (
          <ItemView item={item} onSucess={() => itemSuceeded(itemId)} />
        ) : (
          <></>
        );
      })}
    </>
  );
}
