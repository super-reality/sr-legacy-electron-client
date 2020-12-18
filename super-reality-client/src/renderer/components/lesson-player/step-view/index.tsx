import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Item, ItemFocusTriggers } from "../../../items/item";
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
  const { previewing, treeSteps, treeItems } = useSelector(
    (state: AppState) => state.createLessonV2
  );
  const [itemsState, setItemsState] = useState<ItemsState>({});
  const [itemsShow, setItemsShow] = useState<ItemsState>({});

  const step: IStep | undefined = useMemo(
    () => treeSteps[stepId] || undefined,
    [treeSteps, stepId]
  );

  useEffect(() => {
    const state: ItemsState = {};
    const show: ItemsState = {};
    step.items.forEach((i) => {
      const item: Item | undefined = treeItems[i._id];
      state[i._id] = false;
      show[i._id] = true;
      if (item && item.trigger == null) {
        state[i._id] = true;
      }
    });
    setItemsState(state);
    setItemsShow(show);
  }, [step]);

  const itemSuceeded = useCallback(
    (id: string, trigger: number | null) => {
      console.log(`item sucess event ${id} - trigger: ${trigger}`);
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

  const itemSucess = useCallback(
    (trigger: number | null, item: Item) => {
      if (
        previewing &&
        trigger == item.trigger &&
        itemsState[item._id] == false
      ) {
        itemSuceeded(item._id, trigger);
      }
      if (
        previewing &&
        item.type == "focus_highlight" &&
        trigger == ItemFocusTriggers["Hover target"] &&
        item.trigger !== ItemFocusTriggers["Click target"]
      ) {
        const showState = { ...itemsShow };
        showState[item._id] = false;
        setItemsShow(showState);
      }
    },
    [itemsState, itemsShow]
  );

  const itemKeys: Record<Item["type"], number> = {
    audio: 0,
    dialog: 0,
    focus_highlight: 0,
    fx: 0,
    image: 0,
    video: 0,
    youtube: 0,
  };

  return (
    <>
      {Object.keys(itemsState).map((itemId) => {
        const item: Item | undefined = treeItems[itemId];
        if (item && item.type) {
          itemKeys[item.type] += 1;
        }
        return item &&
          (itemsState[itemId] == false || item.trigger == null) &&
          itemsShow[itemId] ? (
          <ItemView
            key={`item-box-${item.type}-${itemKeys[item.type] || item._id}`}
            item={item}
            anchorId={step.anchor || ""}
            onSucess={(trigger: number | null) => itemSucess(trigger, item)}
          />
        ) : (
          <React.Fragment
            key={item?._id || `${new Date().getTime()}-undef-item`}
          />
        );
      })}
    </>
  );
}
