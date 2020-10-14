import React, { useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  ItemFocusTriggers,
  ItemAudioTriggers,
  ItemImageTriggers,
  ItemVideoTriggers,
  ItemDialogTriggers,
  Item,
} from "../../../api/types/item/item";
import constantFormat from "../../../../utils/constantFormat";
import BaseSelect from "../../base-select";
import Flex from "../../flex";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";
import { Tabs, TabsContainer } from "../../tabs";

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "Settings" | "Anchor" | "Trigger";
const itemModalOptions: ItemModalOptions[] = ["Settings", "Anchor", "Trigger"];

export default function OpenItem(props: OpenItemProps) {
  const dispatch = useDispatch();
  const { treeItems } = useSelector((state: AppState) => state.createLessonV2);
  const [view, setView] = useState<ItemModalOptions>(itemModalOptions[0]);
  const { id } = props;

  const item: Item | null = treeItems[id] || null;
  let triggers: Record<string, number | null> = { None: null };
  if (item) {
    switch (item.type) {
      case "focus_highlight":
        triggers = ItemFocusTriggers;
        break;
      case "audio":
        triggers = ItemAudioTriggers;
        break;
      case "image":
        triggers = ItemImageTriggers;
        break;
      case "video":
        triggers = ItemVideoTriggers;
        break;
      case "dialog":
        triggers = ItemDialogTriggers;
        break;
      default:
        break;
    }
  }

  const setTrigger = useCallback(
    (value: number | null) => {
      reduxAction(dispatch, {
        type: "CREATE_LESSON_V2_SETITEM",
        arg: { item: { ...treeItems[id], trigger: value } },
      });
    },
    [id, dispatch]
  );

  return (
    <>
      <Tabs
        buttons={itemModalOptions}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "42px" }}
      />
      <TabsContainer style={{ height: "200px", overflow: "auto" }}>
        {view === "Settings" && <Flex column />}
        {view === "Anchor" && <Flex column />}
        {view === "Trigger" && (
          <Flex column style={{ width: "-webkit-fill-available" }}>
            <BaseSelect
              title="Trigger"
              current={item.trigger}
              options={Object.values(triggers)}
              optionFormatter={constantFormat(triggers)}
              callback={setTrigger}
            />
          </Flex>
        )}
      </TabsContainer>
    </>
  );
}
