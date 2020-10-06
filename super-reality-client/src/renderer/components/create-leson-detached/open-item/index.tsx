import React, { useCallback, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ItemArea } from "../../../../assets/svg/item-area.svg";
import { ReactComponent as ItemAnchor } from "../../../../assets/svg/item-anchor.svg";
import { ReactComponent as ItemTrigger } from "../../../../assets/svg/item-trigger.svg";
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
import ModalButtons from "../modal-buttons";
import Flex from "../../flex";
import { AppState } from "../../../redux/stores/renderer";
import reduxAction from "../../../redux/reduxAction";

interface OpenItemProps {
  id: string;
}

type ItemModalOptions = "settings" | "anchors" | "trigger";
const itemModalOptions: ItemModalOptions[] = ["settings", "anchors", "trigger"];

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
        arg: { ...treeItems[id], trigger: value },
      });
    },
    [id, dispatch]
  );

  return (
    <Flex
      column
      style={{
        width: "auto",
        height: "200px",
        borderRadius: "4px",
      }}
    >
      <ModalButtons
        buttons={itemModalOptions}
        initial={view}
        callback={setView}
        style={{ width: "-webkit-fill-available", height: "41px" }}
        icons={[ItemArea, ItemAnchor, ItemTrigger]}
      />
      <Flex style={{ height: "calc(100% - 41px)", overflow: "auto" }}>
        {view === "settings" && <Flex column />}
        {view === "anchors" && <Flex column />}
        {view === "trigger" && (
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
      </Flex>
    </Flex>
  );
}
